using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.Net;
using SendGrid.Helpers.Mail;
using SendGrid;

namespace ReactApp1.Server.Services.Email
{
    public class SendGridEmailService(IOptions<EmailSettings> emailSettings) : IEmailService
    {

        private readonly EmailSettings _emailSettings = emailSettings.Value;

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
                Subject = subject,
                HtmlContent = $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <div style='background: #f8f9fa; padding: 20px; border-radius: 5px;'>
                    <h2 style='color: #007bff;'>{subject}</h2>
                    {htmlMessage}
                    <p style='margin-top: 20px; font-size: 0.9em; color: #6c757d;'>
                        Üdvözlettel,<br>
                        {_emailSettings.FromName}
                    </p>
                </div>
            </div>"
            };

            msg.AddTo(new EmailAddress(email));

            var client = new SendGridClient(_emailSettings.SendGridApiKey);
            var response = await client.SendEmailAsync(msg);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Body.ReadAsStringAsync();
                throw new Exception($"Email sending failed: {errorContent}");
            }
            Console.WriteLine($"Email sikeresen elküldve a/az {email} email címre");
        }
    }
}
