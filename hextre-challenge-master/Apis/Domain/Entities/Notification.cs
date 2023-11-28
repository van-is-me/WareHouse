using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Notification : BaseEntity
    {
        [ForeignKey("ApplicationUser")]
        public string ApplicationUserId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsRead { get; set; } = false;
        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
