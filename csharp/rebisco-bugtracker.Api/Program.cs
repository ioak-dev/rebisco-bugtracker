using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using rebisco_bugtracker.Api.domain.defects;

namespace rebisco_bugtracker.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();
            builder.Services.AddDbContext<BugTrackerContext>(options =>
                options.UseMySql(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    new MySqlServerVersion(new Version(8, 0, 29))
                )
            );
            builder.Services.AddScoped<DefectService>();  
            var app = builder.Build();
            app.MapControllers();
            app.Run();
        }
    }
}