using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace LaserCuttingAndEngravingServices.Helpers
{
    public static class EmailEx
    {
        public static bool Send(string userName, string userEmail, string subject, string body)
        {
            var senderEmail = new MailAddress("webadmin@luceva.biz", userName);
            var receiverEmail = new MailAddress("erozada@luceva.biz", "Web Admin");
            var senderEmailPassword = "Leadership1!";
            var smtp = new SmtpClient
            {
                Host = "smtp.luceva.biz",
                Port = 587,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(senderEmail.Address, senderEmailPassword)
            };
            using (var mess = new MailMessage(senderEmail, receiverEmail)
            {
                Subject = subject,
                Body = body
            })
            {
                try
                {
                    smtp.Send(mess);
                }
                catch (Exception ex)
                {
                    // log this exception
                    return false;
                }
            }
            return true;
        }
    }
}
