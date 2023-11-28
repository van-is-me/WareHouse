using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.PostViewModels
{
    public class PostViewModel
    {
        public Guid Id { get; set; }
        public string AuthorId { get; set; }
        public Guid PostCategoryId { get; set; }

        public string Name { get; set; }
        public string NamePostCategory { get; set; }
        public string FullnameAuthor { get; set; }
        public string Image { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public List<string> HashtagName { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
