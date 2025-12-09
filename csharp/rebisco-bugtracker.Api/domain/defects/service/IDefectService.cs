namespace rebisco_bugtracker.Api.domain.defects
{
    public interface IDefectService
    {
        List<Defect> GetAll();
        Defect? Get(int id);
        Defect Create(Defect defect);
        Defect? Update(Defect defect);
        bool Delete(int id);
        Defect? PartialUpdate(int id, Defect model);
        List<Defect> GetDefectsByMonthAndYear(int month, int year);
        Task<BatchResult> BatchUpsert(IFormFile file);
        Task<List<DefectFile>> UploadFileAsync(int defectId, List<IFormFile> files);
        Task<byte[]> GetFilesByDefectAsync(string reference);
        Task<bool> DeleteFileAsync(string reference);
    }
}
