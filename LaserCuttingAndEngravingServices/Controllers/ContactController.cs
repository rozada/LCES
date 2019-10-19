using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using LaserCuttingAndEngravingServices.Helpers;

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
            if (ModelState.IsValid)
            {
                string body = "Need: " + need + "\n" +
                    "Email: " + userEmail + "\n" +
                    message;

                if (EmailEx.Send(name + " " + surname, userEmail, "Contact Page Inquiry", body))
                {
                    return View("SendMessage", "The following message was sent successfully: \n" + message);
                }
                else
                {
                    return View("SendMessage", "We were unable to send your message due to internal errors.");
                }
                  
            }
            else
            {
                return View("SendMessage", "We were unable to send your message due to input validation errors.");
            }          
        }
    }
}