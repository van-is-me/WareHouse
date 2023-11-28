using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class RequestDetail:BaseEntity
    {
        [ForeignKey("Request")]
        public Guid RequestId { get; set; }
        [ForeignKey("Good")]
        public Guid GoodId { get; set; }
        public int Quantity { get; set; }

        public virtual Request Request { get; set; }
        public virtual Good Good { get; set; }
        
    }
}
