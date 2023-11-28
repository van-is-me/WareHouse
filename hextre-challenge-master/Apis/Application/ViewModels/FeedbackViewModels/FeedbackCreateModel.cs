using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.FeedbackViewModels
{
    public class FeedbackCreateModel
    {
        public string Rating { get; set; }
        public string FeedbackText { get; set; }
    }
}
