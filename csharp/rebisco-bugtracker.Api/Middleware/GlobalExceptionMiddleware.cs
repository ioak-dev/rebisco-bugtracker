using Microsoft.EntityFrameworkCore;
using MySqlConnector;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ResponseStatusException ex)
        {
            context.Response.StatusCode = ex.StatusCode;
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            return;
        }
        catch(DbUpdateException dbEx)
        {
            Console.WriteLine(dbEx.Message);
             if (dbEx.InnerException is MySqlException mysqlEx)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(new { error = mysqlEx.Message });
                return;
            }  
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { error = "Database update error" });
            return; 
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { error = "Internal server error" });
            return;
        }
    }
}
