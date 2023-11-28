using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum ContractStatus
    {
        Pending = 1,
        Expired = 2,
        OnGoing = 3,
        Terminating = 4,
        Cancelled = 5
    }
}
