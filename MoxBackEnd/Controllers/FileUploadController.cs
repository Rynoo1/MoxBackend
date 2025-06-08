using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Models; // Adjust namespace as needed
using MoxBackEnd.Data;   // Adjust namespace as needed
using System.Linq;

namespace MoxBackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FileUploadController(AppDbContext context)
        {
            _context = context;
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

        // GET: api/FileUpload/by-subtask/3
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

            // For compatibility with values serialization
            return Ok(new { values = files });
        }
    }
}