using Microsoft.EntityFrameworkCore;
using rebisco_bugtracker.Api.domain.defects;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Amazon.S3;

using Amazon.S3.Model;
using OfficeOpenXml;

namespace rebisco_bugtracker.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            ExcelPackage.License.SetNonCommercialPersonal("Test");
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
                policy.RequireClaim("https://csharp.demo.com/roles", "ADMIN"));
        });

            builder.Services.AddControllers();
            builder.Services.AddScoped<IDefectService, DefectService>();
            builder.Services.AddDbContext<BugTrackerContext>(options =>
                options.UseMySql(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    new MySqlServerVersion(new Version(8, 0, 29))
                )
            );
            builder.Services.AddScoped<IFileStorageGateway>(sp =>
             {
                 var config = sp.GetRequiredService<IConfiguration>();
                 var mode = config["FileStorage:Mode"];
                 return mode switch
                 {
                     "DB" => sp.GetRequiredService<DbStorage>(),
                     "S3" => sp.GetRequiredService<S3FileStorage>(),
                     _ => sp.GetRequiredService<DbStorage>()
                 };
             });
            builder.Services.AddSingleton<IAmazonS3>(sp =>
            {
                var config = sp.GetRequiredService<IConfiguration>();
                return new AmazonS3Client(
                 config["AWS:AccessKey"],
                 config["AWS:SecretKey"],
                 Amazon.RegionEndpoint.USEast1
                   );
            });
            builder.Services.AddScoped<DbStorage>();
            builder.Services.AddScoped<S3FileStorage>();
            builder.Services.AddScoped<DefectService>();
            var app = builder.Build();
            app.UseMiddleware<GlobalExceptionMiddleware>();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}