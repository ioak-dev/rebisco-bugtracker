using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace rebisco_bugtracker.Api.domain.defects
{
    [Table("DefectFiles")]
    public class DefectFile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public int DefectId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public byte[]? FileData { get; set; }
        public string? S3Key { get; set; }
        public string StorageType { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}