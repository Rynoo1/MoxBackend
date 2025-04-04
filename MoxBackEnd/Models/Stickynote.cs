using System;

namespace MoxBackEnd.Models;

public class Stickynote
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

        public string? ProjectsID { get; set; }
        public Projects? Projects { get; set; }

        public int? TaskItemId { get; set; }
        public TaskItem? TaskItem { get; set; }
}
