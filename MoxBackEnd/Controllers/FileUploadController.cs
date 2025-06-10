using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Models; // Adjust namespace as needed
using MoxBackEnd.Data;   // Adjust namespace as needed
using System.Linq;
using MoxBackEnd.Interfaces;


namespace MoxBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IFirebaseStorageService _firebaseStorageService;

        public FileUploadController(AppDbContext context, IFirebaseStorageService firebaseStorageService)
        {
            _context = context;
            _firebaseStorageService = firebaseStorageService;
        }

        [HttpPost]
        public IActionResult UploadFile([FromBody] FileUpload model)
        {
            if (model == null)
                return BadRequest();

            model.UploadDate = DateTime.UtcNow;
            _context.FileUploads.Add(model);
            _context.SaveChanges();

            return Ok(model);
        }


        [HttpGet("by-subtask/{subTaskId}")]
        public IActionResult GetFilesBySubtask(int subTaskId)
        {
            var files = _context.FileUploads
                .Where(f => f.SubTaskID == subTaskId)
                .Select(f => new
                {
                    f.FileUploadID,
                    f.FileName,
                    f.FilePath,
                    f.UploadDate,
                    f.ProjectID,
                    f.SubTaskID
                })
                .ToList();


            return Ok(new { values = files });
        }

        [HttpDelete("{id}")]
public async Task<IActionResult> DeleteFileUpload(int id)
{
    var file = await _context.FileUploads.FindAsync(id);
    if (file == null)
        return NotFound();

    _context.FileUploads.Remove(file);
    await _context.SaveChangesAsync();
    return NoContent();
}
    }
}