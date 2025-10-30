using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace rebisco_bugtracker.Api.domain.defects
{
    [Table("Defects")]
    public class Defect
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string RaisedByTeam { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? Activities { get; set; }

        [Required]
        public string Responsible { get; set; } = string.Empty;

        public string? Priority { get; set; }

        public DateTime? DueDate { get; set; }

        public string? Status { get; set; }

        public DateTime? NextCheck { get; set; }

        public string? Remark { get; set; }

         public DateTime CreatedDate { get; set; }
         
          public DateTime UpdatedDate { get; set; }
    }
}