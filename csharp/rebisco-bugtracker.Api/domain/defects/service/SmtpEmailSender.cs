
using System.Net;
using System.Net.Mail;

namespace rebisco_bugtracker.Api.domain.defects
{

    public class SmtpEmailSender : IEmailSender
    {
        private readonly IConfiguration _config;

        public SmtpEmailSender(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(
            string to,
            string subject,
            string body,
            IEnumerable<(string FileName, byte[] Content)>? attachments = null)
        {
            var host = _config["Smtp:Host"];
            var port = int.Parse(_config["Smtp:Port"]);
            var user = _config["Smtp:User"];
            var pass = _config["Smtp:Pass"];
            var from = _config["Smtp:From"];

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(user, pass)
            };

            var msg = new MailMessage
            {
                From = new MailAddress(from),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            msg.To.Add(to);

            if (attachments != null)
            {
                foreach (var (fileName, content) in attachments)
                {
                    msg.Attachments.Add(new Attachment(new MemoryStream(content), fileName));
                }
            }

            await client.SendMailAsync(msg);
        }
    }

}