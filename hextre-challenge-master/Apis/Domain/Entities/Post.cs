using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Post: BaseEntity
    {
        [ForeignKey("ApplicationUser")]
        public string AuthorId { get; set; }
        [ForeignKey("PostCategory")]
        public Guid PostCategoryId { get; set; }

        public string Name { get; set; }
        public string Image { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }

        public virtual ApplicationUser Author { get; set; }
        public virtual PostCategory PostCategory { get; set; }
        public IList<PostHashtag> PostCategorys { get; set; }

    }
}
