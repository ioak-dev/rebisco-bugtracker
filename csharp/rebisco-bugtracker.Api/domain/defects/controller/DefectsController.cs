using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace rebisco_bugtracker.Api.domain.defects
{
    [ApiController]
    [Route("defects")]
    public class DefectsController : ControllerBase
    {
        private readonly DefectService _service;

        public DefectsController(DefectService service)
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
        public Defect Get(int id)
        {
            var defect = _service.Get(id);
            if (defect is null)
            {
                throw new Exception("Defect not found");
            }
            return defect;
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
            Defect updatedDefect = _service.PartialUpdate(id, model);
             if (updatedDefect is null)
            {
                return NotFound(new { message = "Defect not found" });
            }
            return Ok(updatedDefect);
        }
    }
}
