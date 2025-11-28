using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using MySqlConnector;


namespace rebisco_bugtracker.Api.domain.defects
{
    public class DefectService
    {
        private readonly BugTrackerContext _context;
        private readonly IFileStorageGateway _gateway;
        public DefectService(BugTrackerContext context, IFileStorageGateway gateway)
        {
            _context = context;
            _gateway = gateway;
        }

        public List<Defect> GetAll()
        {
            List<DefectFile> defectFile= _context.DefectFile.ToList();
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
      
        public Defect Create(Defect defect)
        { 
            _context.Defect.Add(defect);
            _context.SaveChanges();
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

        public Defect? PartialUpdate(int id, Defect model)
        {
            var existingDefect = _context.Defect.Find(id);
            if (existingDefect is null)
                throw new ResponseStatusException(404, $"Defect {id} not found");

            try
            {
                var Entry = _context.Entry(existingDefect);
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
                return existingDefect;
            }
            catch(Exception exp)
            {
                  throw new ResponseStatusException(404, $"Defect {id} not found");
            }
        }
        
        public List<Defect> GetDefectsByMonthAndYear(int month, int year)
        {
            if (month < 1 || month > 12)
            throw new ResponseStatusException(400 ,"Month must be between 1 and 12" );
            return _context.Defect
                .FromSqlRaw("CALL sp_GetDefectsByMonthYear({0}, {1})", month, year)
                .ToList();
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

        public BatchResult BatchUpsert(List<DefectImportModel> defects)
        {
            var options = new JsonSerializerOptions
            {
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            };

            string json = JsonSerializer.Serialize(defects, options);
            Console.WriteLine("JSON BEING SENT: " + json);

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

        public Task<List<DefectFile>> UploadFileAsync(int defectId, List<IFormFile> files)
        {
            return _gateway.UploadAsync(files, defectId);
        }


        public Task<byte[]> GetFilesByDefectAsync(string reference)
        {
            return _gateway.DownloadAsync(reference);
        }

        public Task<bool> DeleteFileAsync(string reference)
        {
             return _gateway.DeleteAsync(reference);
        }
    }
}
