using Microsoft.EntityFrameworkCore;
using rebisco_bugtracker.Api.domain.defects;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Amazon.S3;
using Amazon.S3.Model;
using OfficeOpenXml;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

using Microsoft.OpenApi.Models;

namespace rebisco_bugtracker.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Bug Tracker API",
                    Version = "v1",
                    Description = "Documentation for Bug Tracker"
                });

                c.EnableAnnotations();

                // JWT Bearer config in Swagger
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using Bearer scheme. Example: Bearer {token}",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });



            //healthcheck
            builder.Services.AddHealthChecks()
            .AddCheck("self", () => HealthCheckResult.Healthy());

            // UI storage
            builder.Services.AddHealthChecksUI(options =>
            {
                options.AddHealthCheckEndpoint("API Health", "/health");
                options.SetEvaluationTimeInSeconds(50 * 60);
            }).AddInMemoryStorage();
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
            app.UseSwagger();
            app.UseSwaggerUI();

            // Raw JSON health endpoint
            app.MapHealthChecks("/health", new HealthCheckOptions
            {
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });

            // UI Dashboard
            app.MapHealthChecksUI(options =>
            {
                options.UIPath = "/healthchecks-ui";
                options.ApiPath = "/healthchecks-ui-api";
            });

            app.Run();
        }
    }
}