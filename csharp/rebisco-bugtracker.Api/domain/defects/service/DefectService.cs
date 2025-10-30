
namespace rebisco_bugtracker.Api.domain.defects
{
    public class DefectService
    {
        private readonly BugTrackerContext _context;

        public DefectService(BugTrackerContext context)
        {
            _context = context;
        }

        public List<Defect> GetAll()
            => _context.Defect.ToList();

        public Defect? Get(string id)
            => _context.Defect.Find(id);

        public Defect Create(Defect defect)
        {
            _context.Defect.Add(defect);
            _context.SaveChanges();
            return defect;
        }

        public Defect? Update(Defect defect)
        {
            _context.Defect.Update(defect);
            _context.SaveChanges();
            return defect;
        }

        public bool Delete(string id)
        {
            var defect = _context.Defect.Find(id);
            if (defect is null) return false;

            _context.Defect.Remove(defect);
            _context.SaveChanges();
            return true;
        }
    }
}
