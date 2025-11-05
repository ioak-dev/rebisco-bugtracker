using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using rebisco_bugtracker.Api.domain.defects;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
namespace rebisco_bugtracker.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var domain = $"https://{builder.Configuration["Auth0:Domain"]}/";
            var audience = builder.Configuration["Auth0:Audience"];

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.Authority = domain;
            options.Audience = audience;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = domain,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true
            };

            options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                Console.WriteLine($"JWT error: {ctx.Exception.Message}");
                return Task.CompletedTask;
            }
        };
        });
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy =>
                policy.RequireClaim("https://dev-l44w7ox53tffwwle.us.auth0.com/roles", "ADMIN"));
        });
            builder.Services.AddControllers();
            builder.Services.AddDbContext<BugTrackerContext>(options =>
                options.UseMySql(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    new MySqlServerVersion(new Version(8, 0, 29))
                )
            );
            builder.Services.AddScoped<DefectService>();
            var app = builder.Build();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}