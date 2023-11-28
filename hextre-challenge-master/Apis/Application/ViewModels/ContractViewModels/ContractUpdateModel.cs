using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.ContractViewModels
{
    public class ContractUpdateModel
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string File { get; set; }
        public string Description { get; set; }
    }
}
