using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LaserCuttingAndEngravingServices.Models
{
    public class SeedData
    {
        public static void EnsurePopulated(IApplicationBuilder app)
        {
            ApplicationDbContext context = app.ApplicationServices
                .GetRequiredService<ApplicationDbContext>();
            context.Database.Migrate();
            if (!context.Products.Any())
            {
                context.Products.AddRange(
                    new Product { Name = "Name Plate", Price = 16 },
                    new Product { Name = "Panel Tag", Price = (Decimal)12.5 },
                    new Product { Name = "Name Tag", Price = (Decimal)2.5 },
                    new Product { Name = "Rubber Stamp", Price = (Decimal)7.50 });
                context.SaveChanges();
            }
        }
    }
}
