using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

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


        [SwaggerOperation(
             Summary = "Get all defects",
             Description = "Returns a list of all defects available in the database.")]
        [SwaggerResponse(200, "Successfully returned the defect list")]
        [SwaggerResponse(404, "No defects found")]
        [HttpGet]
        [AllowAnonymous]
        public List<Defect> List()
        {
            List<Defect> defects = _service.GetAll();
            return defects;
        }

        [SwaggerOperation(
           Summary = "Get defect by ID",
           Description = "Returns a defect for the given ID")]
        [SwaggerResponse(200, "Successfully returned the defect")]
        [SwaggerResponse(404, "No defects found")]
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult Get(int id)
        {
            var defect = _service.Get(id);
            return Ok(defect);
        }


        [SwaggerOperation(
           Summary = "Post the defect",
           Description = "Insert the defect into a database")]
        [SwaggerResponse(200, "Successfully inserted the defect")]
        [SwaggerResponse(404, "No defects found")]
        [HttpPost]
        [Authorize]
        public Defect Create([FromBody] Defect model)
        {
            Defect created = _service.Create(model);
            return created;
        }

        [SwaggerOperation(
           Summary = "Delete the defect",
           Description = "Deletes the defect from database for given ID")]
        [SwaggerResponse(200, "Successfully deleted the defect")]
        [SwaggerResponse(404, "No defects found")]
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public bool Remove(int id)
        {
            bool success = _service.Delete(id);
            return success;
        }

        [SwaggerOperation(
           Summary = "Update all defects",
           Description = "Updates a list of all defects available in the database.")]
        [SwaggerResponse(200, "Successfully updated the defect list")]
        [SwaggerResponse(404, "No defects found")]
        [HttpPatch("{id}")]
        public IActionResult Update(int id, [FromBody] Defect model)
        {
            Defect? updatedDefect = _service.PartialUpdate(id, model);
            return Ok(updatedDefect);
        }


        [SwaggerOperation(
           Summary = "Upload a file to defect",
           Description = "Returns a list of all defectfiles available in the database or s3.")]
        [SwaggerResponse(200, "Successfully returned the defect file list")]
        [SwaggerResponse(404, "No defects found")]
        [HttpPost("{defectId}/file")]
        public async Task<IActionResult> UploadFile(int defectId, List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No file provided.");
            var uploaded = await _service.UploadFileAsync(defectId, files);
            return Ok(uploaded);
        }


        [SwaggerOperation(
           Summary = "Download a file from defect",
           Description = "Get files available in the database or s3.")]
        [SwaggerResponse(200, "Successfully Downloaded the defect file")]
        [SwaggerResponse(404, "No defects found")]
        [HttpGet("{defectId}/file/{*reference}")]
        public async Task<IActionResult> Download(string reference)
        {
            var fileBytes = await _service.GetFilesByDefectAsync(reference);
            if (fileBytes.Length == 0)
                return NotFound();
            return File(fileBytes, "application/octet-stream");
        }


        [SwaggerOperation(
           Summary = "Delete a file from defect",
           Description = "Deletes a list of all defectfiles available in the database or s3.")]
        [SwaggerResponse(200, "Successfully deleted the defect file")]
        [SwaggerResponse(404, "No defects found")]
        [HttpDelete("{defectId}/file/{*reference}")]
        public async Task<IActionResult> Delete(string reference)
        {
            var ok = await _service.DeleteFileAsync(reference);
            if (!ok)
                return NotFound();
            return NoContent();
        }

        [SwaggerOperation(
             Summary = "Get defects by month",
             Description = "Returns a list of all defect available in the database ")]
        [SwaggerResponse(200, "Successfully returned the defect list")]
        [SwaggerResponse(404, "No defects found")]
        [HttpGet("byDate")]
        public IActionResult GetByMonth([FromQuery] int month, [FromQuery] int year)
        {
            var defects = _service.GetDefectsByMonthAndYear(month, year);
            return Ok(defects);
        }

        [SwaggerOperation(
            Summary = "Batch upsert",
            Description = "Returns a list of all defect inserted into the database ")]
        [SwaggerResponse(200, "Successfully returned the defect list")]
        [SwaggerResponse(404, "No defects found")]
        [HttpPost("import")]
        public async Task<IActionResult> ImportExcel(IFormFile file)
        {        
            var result = await _service.BatchUpsert(file);
            return Ok(result);
        }
    }
}
