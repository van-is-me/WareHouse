using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.RequestDetailViewModel
{
    public class CreateRequestDetailViewModel
    {
        public Guid RequestId { get; set; }
        public Guid GoodId { get; set; }
        public int Quantity { get; set; }
    }
}
