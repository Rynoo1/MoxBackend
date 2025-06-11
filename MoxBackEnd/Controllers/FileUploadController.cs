using Microsoft.AspNetCore.Mvc;
using MoxBackEnd.Models;
using MoxBackEnd.Data;
using System.Linq;
using System.Threading.Tasks;
using System;


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
        public async Task<IActionResult> UploadFile([FromBody] FileUpload model)
        {
            if (model == null ||
                string.IsNullOrEmpty(model.FileName) ||
                string.IsNullOrEmpty(model.FilePath) ||
                model.ProjectID == 0 ||
                model.SubTaskID == 0)
            {
                return BadRequest("Missing required fields.");
            }

            model.UploadDate = DateTime.UtcNow;
            _context.FileUploads.Add(model);
            await _context.SaveChangesAsync();

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