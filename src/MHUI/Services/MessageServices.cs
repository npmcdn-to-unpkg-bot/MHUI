using System.Threading.Tasks;

namespace MHUI.Services
{
    // This class is used by the application to send Email and SMS
    // when you turn on two-factor authentication in ASP.NET Identity.
    // For more details see this link http://go.microsoft.com/fwlink/?LinkID=532713
    public class AuthMessageSender : IEmailSender, ISmsSender
    {
        // Plug in your email service here to send an email.
        public Task SendEmailAsync(string email, string subject, string message) => Task.FromResult(0);

        // Plug in your SMS service here to send a text message.
        public Task SendSmsAsync(string number, string message) => Task.FromResult(0);
    }
}
