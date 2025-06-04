using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models
{
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CommentID { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public int? TaskId { get; set; }
        public Tasks? Task { get; set; }

        public int? ProjectID { get; set; }
        public Projects? Project { get; set; }

        public string? CreatedByUserId { get; set; }
        public Users? CreatedBy { get; set; }
    }
}