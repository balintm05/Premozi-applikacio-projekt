using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.Net;

namespace ReactApp1.Server.Services.Email
{
    public class SendGridEmailService(IOptions<EmailSettings> emailSettings) : IEmailService
    {

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            using (var client = new SmtpClient(emailSettings.Value.SmtpServer, emailSettings.Value.Port))
            {
                client.Credentials = new NetworkCredential(emailSettings.Value.Username, emailSettings.Value.Password);
                client.EnableSsl = true;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(emailSettings.Value.FromAddress, emailSettings.Value.FromName),
                    Subject = subject,
                    Body = htmlMessage,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(email);
                await client.SendMailAsync(mailMessage);
            }
            Console.WriteLine($"Sent email to: {email}");
        }
    }
}
