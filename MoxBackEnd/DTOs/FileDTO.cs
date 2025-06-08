namespace MoxBackEnd.DTOs
{
    public class FileUploadDto
    {
        public int FileUploadID { get; internal set; }
        public int ProjectID { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        
    }
}