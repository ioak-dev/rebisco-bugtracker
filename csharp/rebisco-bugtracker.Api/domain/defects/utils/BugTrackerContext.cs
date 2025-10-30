using Microsoft.EntityFrameworkCore;

namespace rebisco_bugtracker.Api.domain.defects
{
    public class BugTrackerContext : DbContext
    {
        public BugTrackerContext(DbContextOptions<BugTrackerContext> options) : base(options) { }

        public DbSet<Defect> Defect { get; set; }

        public override int SaveChanges()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is Defect && 
                    (e.State == EntityState.Added || e.State == EntityState.Modified));
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                    entry.Property("CreatedDate").CurrentValue = DateTime.UtcNow;
                entry.Property("UpdatedDate").CurrentValue = DateTime.UtcNow;
            }
            return base.SaveChanges();
        }
    }
}