using Microsoft.EntityFrameworkCore;

[Keyless]
public class BatchResult
{
  public int Success { get; set; }
    public int Failures { get; set; }
}
