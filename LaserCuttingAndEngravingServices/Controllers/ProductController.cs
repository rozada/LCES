﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LaserCuttingAndEngravingServices.Models;

namespace LaserCuttingAndEngravingServices.Controllers
{
    public class ProductController : Controller
    {
        private IProductRepository repository;

        public ProductController(IProductRepository repo)
        {
            repository = repo;
        }

        public ViewResult List() => View(repository.Products);
    }
}