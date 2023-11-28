using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.PostViewModels
{
    public class UpdatePostViewModel
    {
        public Guid Id { get; set; }
        public Guid PostCategoryId { get; set; }

        public string Name { get; set; }
        public string Image { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
    }
}
