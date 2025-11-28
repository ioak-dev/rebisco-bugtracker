public class ResponseStatusException : Exception
{
    public int StatusCode { get; }

    public ResponseStatusException(int statusCode, string message)
        : base(message)
    {
        StatusCode = statusCode;
    }
}
