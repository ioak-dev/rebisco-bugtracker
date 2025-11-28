using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace rebisco_bugtracker.Api.domain.defects
{
    [ApiController]
    [Route("defects")]
    public class DefectsController : ControllerBase
    {
        private readonly IDefectService _service;

        public DefectsController(IDefectService service)
        {
            _service = service;
        }
        
        [HttpGet]
        [AllowAnonymous]
        public List<Defect> List()
        {
            List<Defect> defects = _service.GetAll();
            return defects;
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult Get(int id)
        {
            var defect = _service.Get(id);
            return Ok(defect);
        }

        [HttpPost]
        [Authorize]
        public Defect Create([FromBody] Defect model)
        {
            Defect created = _service.Create(model);
            return created;
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public bool Remove(int id)
        {
            bool success = _service.Delete(id);
            return success;
        }

        [HttpPatch("{id}")]
        public IActionResult Update(int id, [FromBody] Defect model)
        {
            Defect? updatedDefect = _service.PartialUpdate(id, model);
            return Ok(updatedDefect);
        }



        [HttpPost("{defectId}/file")]
        public async Task<IActionResult> UploadFile(int defectId, List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No file provided.");
            var uploaded = await _service.UploadFileAsync(defectId, files);
            return Ok(uploaded);
        }

        [HttpGet("{defectId}/file/{*reference}")]
        public async Task<IActionResult> Download(string reference)
        {
            var fileBytes = await _service.GetFilesByDefectAsync(reference);
            if (fileBytes.Length == 0)
                return NotFound();
            return File(fileBytes, "application/octet-stream");
        }

        [HttpDelete("{defectId}/file/{*reference}")]
        public async Task<IActionResult> Delete(string reference)
        {
            var ok = await _service.DeleteFileAsync(reference);
            if (!ok)
                return NotFound();
            return NoContent();
        }

        [HttpGet("byDate")]
        public IActionResult GetByMonth([FromQuery] int month, [FromQuery] int year)
        {
            var defects = _service.GetDefectsByMonthAndYear(month, year);
            return Ok(defects);
        }

        [HttpPost("import")]
        public async Task<IActionResult> ImportExcel(IFormFile file)
        {
            Console.WriteLine("inside method");
            if (file == null || file.Length == 0)
                return BadRequest("File is required.");

            var defects = await _service.ReadExcel(file);
            Console.WriteLine("Defects is "+defects);

            var result = _service.BatchUpsert(defects);

            return Ok(result);
        }
    }
}
