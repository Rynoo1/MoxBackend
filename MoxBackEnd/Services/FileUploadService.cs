using System.Collections.Generic;
using System.Linq;
using MoxBackEnd.Data;
using MoxBackEnd.DTOs;

public class FileUploadService
{
    private readonly AppDbContext _context;

    public FileUploadService(AppDbContext context)
    {
        _context = context;
    }

    public List<FileUploadDto> GetFilesBySubtask(int subTaskId)
    {
        
        return _context.FileUploads
            .Where(f => f.SubTaskID == subTaskId)
            .Select(f => new FileUploadDto
            {
                FileUploadID = f.FileUploadID,
                FileName = f.FileName,
                FilePath = f.FilePath,
                UploadDate = f.UploadDate
            })
            .ToList();
    }
}
