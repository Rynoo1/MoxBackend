public class CommentDto
{
    public int CommentID { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? CreatedByUserName { get; set; }
    public string? CreatedByUserId { get; set; }
}