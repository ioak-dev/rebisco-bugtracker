using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using MySqlConnector;
using System.Text;


namespace rebisco_bugtracker.Api.domain.defects
{
    public class DefectService : IDefectService
    {
        private readonly BugTrackerContext _context;
        private readonly IFileStorageGateway _gateway;

        private readonly IEmailSender _emailSender;
        public DefectService(BugTrackerContext context, IFileStorageGateway gateway,
        IEmailSender emailSender)
        {
            _context = context;
            _gateway = gateway;
            _emailSender = emailSender;
        }

        public List<Defect> GetAll()
        {
            List<DefectFile> defectFile = _context.DefectFile.ToList();
            _context.Defect.ToList().ForEach(defect =>
            {
                defect.Files = defectFile.Where(f => f.DefectId == defect.Id).ToList();
            });
            return _context.Defect.ToList();
        }

        public Defect? Get(int id)
        {
            var defect = _context.Defect.Find(id);
            if (defect is null)
            {
                throw new ResponseStatusException(404, $"Defect with id {id} not found");
            }
            defect.Files = _context.DefectFile
                   .Where(f => f.DefectId == defect.Id)
                   .ToList();
            return defect;
        }

        public async Task<Defect> Create(Defect defect)
        {
            try
            {
                _context.Defect.Add(defect);
                _context.SaveChanges();
                if (defect.notify)
                {
                    await _emailSender.SendEmailAsync(
                         defect.Responsible,
                         $"New Defect Assigned: {defect.Description}",
                         $"<p>A new defect was created:</p><p><b>{defect.Description}</b></p>",
                         null
                         );
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            return defect;

        }

        public Defect? Update(Defect defect)
        {
            _context.Defect.Update(defect);
            _context.SaveChanges();
            return defect;
        }

        public bool Delete(int id)
        {
            var defect = _context.Defect.Find(id);
            if (defect is null)
                throw new ResponseStatusException(404, $"Defect with id {id} not found");
            _context.Defect.Remove(defect);
            _context.SaveChanges();
            return true;
        }

        public async Task<Defect?> PartialUpdate(int id, Defect model)
        {
            var existingDefect = _context.Defect.Find(id);
            if (existingDefect is null)
                throw new ResponseStatusException(404, $"Defect {id} not found");
            var oldDefect = existingDefect.ShallowCopy();
            foreach (var property in typeof(Defect).GetProperties())
            {
                if (property.Name is nameof(Defect.Id) or nameof(Defect.CreatedDate))
                    continue;

                var newValue = property.GetValue(model);
                if (newValue != null)
                {
                    property.SetValue(existingDefect, newValue);
                }
            }
            _context.SaveChanges();
            if (model.notify)
            {
                string changesSummary = BuildChangesSummary(oldDefect, existingDefect);
                foreach (var to in new[] { existingDefect.CreatedBy, existingDefect.Responsible })
                {
                    if (!string.IsNullOrWhiteSpace(to))
                    {
                        await _emailSender.SendEmailAsync(
                            to,
                            $"Defect Updated: {existingDefect.Description}",
                            $"<p>The defect has been updated.</p><p>{changesSummary}</p>",
                            null
                        );
                    }
                }
            }
            _context.Entry(existingDefect).State = EntityState.Detached;
            return existingDefect;
        }


        public List<Defect> GetDefectsByMonthAndYear(int month, int year)
        {
            if (month < 1 || month > 12)
                throw new ResponseStatusException(400, "Month must be between 1 and 12");
            return _context.Defect
                .FromSqlRaw("CALL sp_GetDefectsByMonthYear({0}, {1})", month, year)
                .ToList();
        }

       public async Task<BatchResult> BatchUpsert(IFormFile file)
        {
            var defects = await ReadExcel(file);
            var options = new JsonSerializerOptions
            {
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            };

            string json = JsonSerializer.Serialize(defects, options);
           // Console.WriteLine("JSON BEING SENT: " + json);

            using var cmd = _context.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "bugtracker.sp_BatchUpsertDefects";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            var jsonParam = new MySqlConnector.MySqlParameter("@defectsJson", MySqlConnector.MySqlDbType.LongText)
            {
                Value = json
            };
   
            cmd.Parameters.Add(jsonParam);
            _context.Database.OpenConnection();
            using var reader = cmd.ExecuteReader();

            if (!reader.Read())
                return new BatchResult { Success = 0, Failures = 0 };

            int success = reader.IsDBNull(reader.GetOrdinal("Success"))
                ? 0
                : reader.GetInt32(reader.GetOrdinal("Success"));

            int failures = reader.IsDBNull(reader.GetOrdinal("Failures"))
                ? 0
                : reader.GetInt32(reader.GetOrdinal("Failures"));

            return new BatchResult
            {
                Success = success,
                Failures = failures
            };
        }

        public async Task<List<DefectImportModel>> ReadExcel(IFormFile file)
        {
            var defects = new List<DefectImportModel>();
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            stream.Position = 0;

            using var package = new ExcelPackage(stream);
            var worksheet = package.Workbook.Worksheets[0];
            int rowCount = worksheet.Dimension.Rows;

            for (int row = 2; row <= rowCount; row++) 
            {
            defects.Add(new DefectImportModel
                {
                    Id = int.TryParse(worksheet.Cells[row, 1].Text, out var id) ? id : (int?)null,
                    Description = worksheet.Cells[row, 2].Text,
                    Priority = int.TryParse(worksheet.Cells[row, 3].Text, out var priority) ? priority : (int?)null,
                    RaisedByTeam = worksheet.Cells[row, 4].Text,
                    Responsible = worksheet.Cells[row, 5].Text,
                });
            }
             return defects;
        }

        public async Task<List<DefectFile>> UploadFileAsync(int defectId, List<IFormFile> files)
        {
            // Upload files to DB or storage
            var defectFiles = await _gateway.UploadAsync(files, defectId);
            var defect = _context.Defect.Find(defectId);
            if (defect != null && defect.notify)
            {
                var attachments = new List<(string FileName, byte[] Content)>();
                foreach (var file in files)
                {
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms);
                    attachments.Add((file.FileName, ms.ToArray()));
                }
                foreach (var to in new[] { defect.CreatedBy, defect.Responsible })
                {
                    if (!string.IsNullOrWhiteSpace(to))
                    {
                        await _emailSender.SendEmailAsync(
                            to,
                            $"New File(s) Uploaded for Defect: {defect.Description}",
                            "<p>A new file has been uploaded to the defect.</p>",
                            attachments
                        );
                    }
                }
            }
            return defectFiles;
        }


        public Task<byte[]> GetFilesByDefectAsync(string reference)
        {
            return _gateway.DownloadAsync(reference);
        }

        public Task<bool> DeleteFileAsync(string reference)
        {
            return _gateway.DeleteAsync(reference);
        }


        private string BuildChangesSummary(Defect oldDefect, Defect newDefect)
        {
            var sb = new StringBuilder("<ul>");
            foreach (var prop in typeof(Defect).GetProperties())
            {
                var oldVal = prop.GetValue(oldDefect)?.ToString();
                var newVal = prop.GetValue(newDefect)?.ToString();
                if (oldVal != newVal)
                {
                    sb.Append($"<li><b>{prop.Name}:</b> {oldVal} → <span style='background:#d4edda; color:#155724; padding:2px 6px; border-radius:4px;'>{newVal}</span></li>");
                }
            }
            sb.Append("</ul>");
            return sb.ToString();
        }

    }
}
