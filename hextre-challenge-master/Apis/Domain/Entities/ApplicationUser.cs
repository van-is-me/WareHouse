﻿
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ApplicationUser: IdentityUser
    {
        public string Fullname { get; set; }
        public string Address { get; set; }
        public string Avatar { get; set; }
        public DateTime Birthday { get; set; }

        public IList<Feedback> Feedbacks { get; set; }
        public IList<Order> OrderDetail { get; set; }
        public IList<Post> Posts { get; set; }
        public IList<Contract> Contracts { get; set; }
        public IList<Request> Request { get; set; }

    }
}
