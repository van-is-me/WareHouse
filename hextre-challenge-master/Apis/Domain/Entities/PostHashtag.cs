using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class PostHashtag: BaseEntity
    {
        [ForeignKey("Post")]
        public Guid PostId { get; set; }
        [ForeignKey("Hashtag")]
        public Guid HashtagId { get; set; }


        public virtual Post Post{ get; set; }
        public virtual Hashtag Hashtag { get; set; }

    }
}
