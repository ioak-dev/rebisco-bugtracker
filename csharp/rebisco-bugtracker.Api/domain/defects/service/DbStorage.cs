using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace rebisco_bugtracker.Api.domain.defects
{
    public class DbStorage : IFileStorageGateway
    {
        private readonly BugTrackerContext _context;

        public DbStorage(BugTrackerContext context)
        {
            _context = context;
        }

        public async Task<List<DefectFile>> UploadAsync(List<IFormFile> files, int defectId)
        {
            try
            {
                var defect = await _context.Defect.FindAsync(defectId);
                if (defect == null)
                    throw new KeyNotFoundException($"Defect {defectId} not found.");
                var uploadedFiles = new List<DefectFile>();
                foreach (var file in files)
                {
                    using var memoryStream = new MemoryStream();
                    await file.CopyToAsync(memoryStream);
                    var defectFile = new DefectFile
                    {
                        Id = Guid.NewGuid(),
                        DefectId = defectId,
                        FileName = file.FileName,
                        StorageType = "DB",
                        ContentType = file.ContentType,
                        FileData = memoryStream.ToArray(),
                        UploadedAt = DateTime.UtcNow
                    };
                    uploadedFiles.Add(defectFile);
                    _context.DefectFile.Add(defectFile);
                }
                await _context.SaveChangesAsync();
                return uploadedFiles;
            }
            catch (DbException)
            {
                throw;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<byte[]> DownloadAsync(string reference)
        {
            var id = Guid.Parse(reference);
            var file = await _context.DefectFile.FindAsync(id);
            return file?.FileData ?? Array.Empty<byte>();
        }

        public async Task<bool> DeleteAsync(string reference)
        {
            try
            {
                var id = Guid.Parse(reference);
                var file = await _context.DefectFile.FindAsync(id);
                if (file == null) return false;
                _context.DefectFile.Remove(file);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbException)
            {
                throw;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}