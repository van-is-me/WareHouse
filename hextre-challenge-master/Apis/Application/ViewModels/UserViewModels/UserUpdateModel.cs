﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.UserViewModels
{
    public class UserUpdateModel
    {
        public string Fullname { get; set; }
        public string Address { get; set; }
        public string Avatar { get; set; }
        public DateTime Birthday { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
