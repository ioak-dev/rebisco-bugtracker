namespace rebisco_bugtracker.Api.domain.defects
{
public interface IFileStorageGateway
{
    Task<List<DefectFile>> UploadAsync(List<IFormFile> files, int defectId);
    Task<byte[]> DownloadAsync(string reference);
    Task<bool> DeleteAsync(string reference);
}
}
