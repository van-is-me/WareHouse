using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.RequestDetailViewModel
{
    public class RequestDetailViewModel
    {
        public Guid Id { get; set; }
        public Guid RequestId { get; set; }
        public Guid GoodId { get; set; }
        public int Quantity { get; set; }
    }
}
