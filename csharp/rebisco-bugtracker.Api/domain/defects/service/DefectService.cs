using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

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
            if (defect != null)
            {
                defect.Files = _context.DefectFile
                    .Where(f => f.DefectId == defect.Id)
                    .ToList();
            }
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
            if (defect is null) return false;

            _context.Defect.Remove(defect);
            _context.SaveChanges();
            return true;
        }

        public Defect? PartialUpdate(int id, Defect model)
        {
            var existingDefect = _context.Defect.Find(id);
            if (existingDefect is null) return null;
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
