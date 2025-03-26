using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoxBackEnd.Models
{
    public class StickyNote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        public string? NoteType { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Required]
        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;

        public string? GroupID { get; set; }
        public Group? Group { get; set; }

        public int? TaskItemId { get; set; }
        public TaskItem? TaskItem { get; set; }
    }
}