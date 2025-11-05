
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

        public Defect? Get(int id)
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

        public bool Delete(int id)
        {
            var defect = _context.Defect.Find(id);
            if (defect is null) return false;

            _context.Defect.Remove(defect);
            _context.SaveChanges();
            return true;
        }

        public Defect? PartialUpdate(int id, Defect model)
        {
            var existingDefect = _context.Defect.Find(id);
            if (existingDefect is null) return null;
            var Entry = _context.Entry(existingDefect);
            foreach (var property in typeof(Defect).GetProperties())
            {
                if (property.Name == nameof(Defect.Id))
                    continue;

                var newValue = property.GetValue(model);
                if (newValue != null)
                {
                    property.SetValue(existingDefect, newValue);
                }
            } 
            _context.SaveChanges();
            return existingDefect;
        }
    }
}
