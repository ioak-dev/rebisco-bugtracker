using Quartz;
using Microsoft.EntityFrameworkCore;
using rebisco_bugtracker.Api.domain.defects;
using System.Text;

public class WeeklyDefectsExportJob : IJob
{
    private readonly BugTrackerContext _context;
    private readonly IFileStorageGateway _gateway;

    public WeeklyDefectsExportJob(BugTrackerContext db, IFileStorageGateway gateway)
    {
        _context = db;
        _gateway = gateway;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        Console.WriteLine("Weekly Defects Export Job execution started");
        var twoDaysAgo = DateTime.Now.AddDays(-2); 
        var defects = await _context.Defect.Where(d => d.Priority == 1 && d.UpdatedDate <= twoDaysAgo)
        .ToListAsync();

        Console.WriteLine("Records fetched are "+defects.Count);

        if (!defects.Any())
        {
            Console.WriteLine("No defects found for export.");
            return;
        }

        // 2️⃣ Export to CSV file
        var fileName = $"DefectsExport_{DateTime.Now:yyyyMMdd}.csv";
        var projectRoot = Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory)!.Parent!.Parent!.FullName;
        var exportDir = Path.Combine(projectRoot, "Exports");
        Directory.CreateDirectory(exportDir);
        var filePath = Path.Combine(exportDir, fileName);

        var lines = new List<string> { "Id,Description,Priority,RaisedByTeam,Responsible,CreatedDate,UpdatedDate" };

        lines.AddRange(defects.Select(d =>
            $"{d.Id},{Escape(d.Description)},{d.Priority},{Escape(d.RaisedByTeam)},{Escape(d.Responsible)},{d.CreatedDate:yyyy-MM-dd},{d.UpdatedDate:yyyy-MM-dd}"
        ));

         var csvContent = string.Join(Environment.NewLine, lines);
         var bytes = Encoding.UTF8.GetBytes(csvContent);
         using var stream = new MemoryStream(bytes);


          IFormFile csvFile = new FormFile(stream, 0, bytes.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "text/csv"
            };

        await File.WriteAllLinesAsync(filePath, lines);
        await _gateway.UploadAsync(new List<IFormFile> { csvFile }, defectId: 1);
        Console.WriteLine("Weekly Defects Export Job COMPLETED.");
    }

    private string Escape(string input)
    {
        if (input == null) return "";
        return input.Replace(",", ";").Replace("\n", " ").Replace("\r", " ");
    }
}
