using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.GoodViewModels
{
    public class GoodViewModel
    {
        public Guid Id { get; set; }
        public Guid RentWarehouseId { get; set; }
        public Guid GoodCategoryId { get; set; }
        public string GoodName { get; set; }
        public int Quantity { get; set; }
        public string GoodUnit { get; set; }
        public string Description { get; set; }

        public virtual RentWarehouse RentWarehouse { get; set; }
        public virtual GoodCategory GoodCategory { get; set; }
        public IList<GoodImage> GoodImages { get; set; }
    }
}
