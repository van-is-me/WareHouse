using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class GoodImage:BaseEntity
    {
        [ForeignKey("Good")]
        public Guid GoodId { get; set; }
        public string ImageUrl { get; set; }

        public virtual Good Good { get; set; }
    }
}
