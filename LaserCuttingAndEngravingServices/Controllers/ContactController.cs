using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace LaserCuttingAndEngravingServices.Controllers
{
    public class ContactController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SendMessage(string name, string surname, string userEmail, string need, string message)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var senderEmail = new MailAddress("webadmin@luceva.biz", name + " " + surname);
                    var receiverEmail = new MailAddress("erozada@luceva.biz", "Web Admin");
                    var senderEmailPassword = "Leadership1!";
                    var body = message;
                    var smtp = new SmtpClient
                    {
                        Host = "smtp.luceva.biz",
                        Port = 587,
                        //EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(senderEmail.Address, senderEmailPassword)
                    };
                    using (var mess = new MailMessage(senderEmail, receiverEmail)
                    {
                        Subject = "Web Inquiry",
                        Body = "Need: " + need + "\n" +
                        "Email: " + userEmail + "\n" +
                        body
                    })
                    {
                        smtp.Send(mess);
                    }
                    return View("SendMessage","The following message was sent successfully: \n" + body);
                }
                return View("SendMessage","We were unable to send your message.");
            }
            catch (Exception ex)
            {
                return View("SendMessage","An error was encountered when transmitting your message.");
                ViewBag.Error = ex.Message;
            }
        }
    }
}