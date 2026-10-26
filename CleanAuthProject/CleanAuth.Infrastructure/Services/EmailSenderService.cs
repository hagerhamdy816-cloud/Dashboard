using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EmailSenderService : IEmailSender
    {

        public async Task SendAsync(string to, string subject, string body)
        {
            var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("YOUR_EMAIL@gmail.com", "APP_PASSWORD"),
                EnableSsl = true
            };

            await smtp.SendMailAsync("YOUR_EMAIL@gmail.com", to, subject, body);


        }
    }
}
