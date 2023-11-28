using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.PostHashtagViewModels
{
    public class PostHashtagViewModel
    {
        public Guid Id { get; set; }
        public Guid PostId { get; set; }
        public string NamePost { get; set; }
        public Guid HashtagId { get; set; }
        public string HashtagName { get; set; }
    }
}
