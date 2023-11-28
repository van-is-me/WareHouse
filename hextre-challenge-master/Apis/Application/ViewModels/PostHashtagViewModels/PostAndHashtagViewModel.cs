using Application.ViewModels.HashtagViewModels;
using Application.ViewModels.PostViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.PostHashtagViewModels
{
    public class PostAndHashtagViewModel
    {
        public List<PostViewModel> Posts { get; set; }
        public List<HashtagViewModel> Hashtags { get; set; }
    }
}
