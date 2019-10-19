using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

namespace LaserCuttingAndEngravingServices.Controllers
{
    public class PanelTagsController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        public PanelTagsController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }
        // GET: PanelTags
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> UploadSVG()
        {
            string contentRootPath = _hostingEnvironment.ContentRootPath;

            var file = Request.Form.Files[0];
           
            if (file != null)
            {
                var dt = DateTime.Now;
                var fileName = "SVGUpload_" + String.Format("{0:d_M_yyyy_HH.mm.ss.fff}" + ".svg", dt);
                var filePath = Path.Combine(contentRootPath, "UploadSvgs", fileName);
               
                try
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    return Json(fileName);
                }
                catch (Exception ex)
                {
                    return Json(ex.Message);
                }
            }
            return Json("No data uploaded!");

        }

        // GET: PanelTags/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PanelTags/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PanelTags/Create
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

        // GET: PanelTags/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PanelTags/Edit/5
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

        // GET: PanelTags/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PanelTags/Delete/5
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