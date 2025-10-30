using System.ComponentModel;
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
        public List<Defect> List()
        {
            List<Defect> defects = _service.GetAll();
            return defects;
        }

        [HttpGet("{id}")]
        public Defect Get(string id)
        {
            Defect? defect = _service.Get(id);
            if (defect is null)
            {
                throw new Exception("Defect not found");
            }
            return defect;
        }

        [HttpPost]
        public Defect Create([FromBody] Defect model)
        {
            Defect created = _service.Create(model);
            return created;
        }

        [HttpDelete("{id}")]
        public bool Remove(string id)
        {
            bool success = _service.Delete(id);
            return success;
        }
    }
}
