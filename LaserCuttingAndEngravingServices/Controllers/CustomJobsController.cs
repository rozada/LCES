using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using LaserCuttingAndEngravingServices.Helpers;

namespace LaserCuttingAndEngravingServices.Controllers
{
    public class CustomJobsController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        public CustomJobsController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }


        // GET: CustomJobs
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost("FileUpload")]
        public async Task<IActionResult> FileUpload(List<IFormFile> files,  string jobDescription, string lastName, string firstName, string userEmail)
        {
            string webRootPath = _hostingEnvironment.WebRootPath;
            string contentRootPath = _hostingEnvironment.ContentRootPath;

            long size = files.Sum(f => f.Length);

            var filePaths = new List<string>();
            var fileNames = new StringBuilder();
            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    // full path to file in temp location
                    var fileName = Path.GetFileName(formFile.FileName);
                    var filePath = Path.Combine(contentRootPath,"Uploads", fileName);// Path.GetTempFileName();
                    fileNames.Append(fileName);
                    filePaths.Add(filePath);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }

            var sendResult = string.Empty;
            var body = jobDescription + "\n" + "Files: " + fileNames.ToString();
            if (EmailEx.Send(lastName + "," + firstName, userEmail, "Job Request", body))
            {
                ViewBag.Status = "Your job request was successfully sent!";
                sendResult = "Customer: " + lastName + "," + firstName + "\n";
                sendResult += "Email: " + userEmail + "\n";
                sendResult += "File Count: " + files.Count + "\n";
                sendResult += "Size: " + size + "\n";
                sendResult += "Files: " + fileNames.ToString();
            }
            else
            {
                ViewBag.Status = "Your job request was not successfully sent";
            }

            return View("FileUpload", sendResult);
            // process uploaded files
            // Don't rely on or trust the FileName property without validation.

            //return Ok(new { count = files.Count, size, filePaths });
        }

        // GET: CustomJobs/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: CustomJobs/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: CustomJobs/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: CustomJobs/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: CustomJobs/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: CustomJobs/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: CustomJobs/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}