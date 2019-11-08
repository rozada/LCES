using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LaserCuttingAndEngravingServices.Models
{
    public class FakeProductRepository : IProductRepository 
    {
        public IQueryable<Product> Products => new List<Product> {
            new Product { Name= "Name Plate" , Price = 16},
            new Product { Name = "Panel Tag", Price = (Decimal)12.5},
            new Product { Name = "Rubber Stamp", Price = (Decimal)7.50}
        }.AsQueryable();
    }
}
