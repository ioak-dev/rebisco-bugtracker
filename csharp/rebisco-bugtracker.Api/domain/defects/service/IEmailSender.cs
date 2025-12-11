namespace rebisco_bugtracker.Api.domain.defects
{

    public interface IEmailSender
    {
        Task SendEmailAsync(
            string to,
            string subject,
            string body,
            IEnumerable<(string FileName, byte[] Content)>? attachments = null);
    }

}
