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
            try
            {
                var client = new SendGridClient(_emailSettings.SendGridApiKey);
                var from = new EmailAddress(_emailSettings.FromEmail, _emailSettings.FromName);
                var to = new EmailAddress(email);
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent: null, htmlMessage);

                var response = await client.SendEmailAsync(msg);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Body.ReadAsStringAsync();
                    Console.WriteLine($"Failed to send email to {email}. Status: {response.StatusCode}, Error: {errorContent}");
                }
                else
                {
                    Console.WriteLine($"Successfully sent email to: {email}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception while sending email to {email}: {ex.Message}");
                throw; 
            }
        }
    }
}
