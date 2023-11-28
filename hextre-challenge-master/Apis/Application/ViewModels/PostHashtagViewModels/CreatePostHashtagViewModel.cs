using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.PostHashtagViewModels
{
    public class CreatePostHashtagViewModel
    {
        public Guid PostId { get; set; }
        public List<Guid> HashtagId { get; set; }
    }
}
