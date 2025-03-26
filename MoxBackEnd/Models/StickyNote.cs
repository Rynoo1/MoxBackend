using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Models
{
    public class StickyNote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        // Optional categorization: general, urgent, edit, etc.
        public string? NoteType { get; set; }  // You could use an enum or string

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Who added the note
        [Required]
        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;

        // What it's attached to
        public int? ProjectId { get; set; }
        public Group? Project { get; set; }

        public int? TaskItemId { get; set; }
        public TaskItem? TaskItem { get; set; }

        public int? FileUploadId { get; set; }
        public FileUpload? FileUpload { get; set; }
    }
}
