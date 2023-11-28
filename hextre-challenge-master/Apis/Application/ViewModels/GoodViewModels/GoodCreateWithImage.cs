using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.GoodViewModels
{
    public class GoodCreateWithImage
    {
        public GoodCreateModel GoodCreateModel { get; set; }
        public IList<string> Images { get; set; }
    }
}
