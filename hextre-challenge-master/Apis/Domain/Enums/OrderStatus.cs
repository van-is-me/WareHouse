using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum OrderStatus
    {
        Pending = 1,
        Processing = 2,
        Scheduled = 3,
        Cancelled = 4,
        Complete= 5,
        Rescheduling= 6,

    }
}
