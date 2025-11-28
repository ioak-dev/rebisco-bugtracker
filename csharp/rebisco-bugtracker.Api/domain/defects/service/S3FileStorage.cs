using Amazon.S3;
using Amazon.S3.Model;

namespace rebisco_bugtracker.Api.domain.defects
{
    public class S3FileStorage : IFileStorageGateway
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucket;
        private readonly BugTrackerContext _context;

        public S3FileStorage(
            IAmazonS3 s3Client,
            IConfiguration config,
            BugTrackerContext context)
        {
            _s3Client = s3Client;
            _bucket = config["AWS:Bucket"];
            _context = context;
        }

        public async Task<List<DefectFile>> UploadAsync(List<IFormFile> files, int defectId)
        {
            try
            {
                List<DefectFile> references = new();
                foreach (var file in files)
                {
                    var uniqueName = $"{Guid.NewGuid()}_{file.FileName}";
                    var key = $"{defectId}/{uniqueName}";
                    using var stream = file.OpenReadStream();
                    await _s3Client.PutObjectAsync(new PutObjectRequest
                    {
                        BucketName = _bucket,
                        Key = key,
                        InputStream = stream,
                        ContentType = file.ContentType
                    });
                    var df = new DefectFile
                    {
                        Id = Guid.NewGuid(),
                        DefectId = defectId,
                        FileName = file.FileName,
                        ContentType = file.ContentType,
                        FileData = null,
                        S3Key = key,
                        StorageType = "S3",
                        UploadedAt = DateTime.UtcNow
                    };
                    _context.DefectFile.Add(df);
                    references.Add(df);
                }
                await _context.SaveChangesAsync();
                return references;
            }
            catch (AmazonS3Exception)
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
            var df = await _context.DefectFile.FindAsync(id);
            if (df == null || df.S3Key == null)
                return Array.Empty<byte>();
            var obj = await _s3Client.GetObjectAsync(_bucket, df.S3Key);
            using var ms = new MemoryStream();
            await obj.ResponseStream.CopyToAsync(ms);
            return ms.ToArray();
        }

        public async Task<bool> DeleteAsync(string reference)
        {
            try
            {
                var id = Guid.Parse(reference);
                var df = await _context.DefectFile.FindAsync(id);
                if (df == null)
                    return false;
                if (df.S3Key != null)
                {
                    await _s3Client.DeleteObjectAsync(_bucket, df.S3Key);
                }
                _context.DefectFile.Remove(df);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (AmazonS3Exception)
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