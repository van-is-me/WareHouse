using Application.Commons;
using Application.Interfaces;
using Application.ViewModels;
using Application.ViewModels.AuthViewModel;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AuthService 
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        public readonly IWebHostEnvironment _environment;

        public AuthService
            (UserManager<ApplicationUser> userManager,
             SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            IWebHostEnvironment environment)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _environment = environment;
        }
        public async Task<LoginViewModel> Login(string email, string pass, string callbackUrl)
        {
            var user = await _userManager.FindByNameAsync(email);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    throw new KeyNotFoundException($"Không tìm thấy tên đăng nhập hoặc địa chỉ email '{email}'");
                }
            }
            if (user.EmailConfirmed == false)
            {
                var result = await SendEmailConfirmAsync(email.Trim(), callbackUrl);
                throw new Exception("This account has not authenticated Email. Please check the email you just sent or contact the administrator for support!");
            }
            else
            {
                var result = await AuthenticateAsync(email.Trim(), pass.Trim());

                if (result != null)
                {

                    var roles = await _userManager.GetRolesAsync(user);
                    var userModel = new LoginViewModel();
                    userModel.Id = user.Id;
                    userModel.Email = user.Email;
                    userModel.Fullname = user.Fullname;
                    userModel.Username = user.UserName;
                    userModel.Avatar = user.Avatar;
                    userModel.listRoles = roles.ToList();
                    userModel.Token = result;
                    return userModel;
                }

                throw new AuthenticationException("Đăng nhập không thành công!");
            }
        }


        public async Task<ErrorViewModel> Register(RegisterModel model)
        {
            var resultData = await CreateUserAsync(model);
            if (resultData.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                var addRoleResult = await _userManager.AddToRoleAsync(user, "Customer");
                if (addRoleResult.Succeeded)
                {
                    return null;
                }
                else
                {
                    await _userManager.DeleteAsync(user);
                    throw new Exception("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại!");
                }
            }
            else
            {
                ErrorViewModel errors = new ErrorViewModel();
                errors.Errors = new List<string>();
                errors.Errors.AddRange(resultData.Errors.Select(x => x.Description));
                return errors;
            }
        }

        public async Task<IdentityResult> CreateUserAsync(RegisterModel model)

        {
            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                Fullname = model.Fullname,
                Avatar = model.Avatar,
                Address = model.Address,
                Birthday = model.Birthday,
                PhoneNumber = model.PhoneNumber
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            return result;
        }

        public async Task<bool> IsInRoleAsync(string userId, string role)
        {
            var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

            return user != null && await _userManager.IsInRoleAsync(user, role);
        }

        public async Task<string> AuthenticateAsync(string username, string password)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(username);
                if (user == null)
                {
                    throw new KeyNotFoundException($"Không tìm thấy tên đăng nhập hoặc địa chỉ email '{username}'");
                }
            }
            if (user.LockoutEnd != null && user.LockoutEnd.Value > DateTime.Now)
            {
                throw new KeyNotFoundException($"Tài khoản này hiện tại đang bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ");
            }
            if (user.EmailConfirmed == false)
            {
                throw new KeyNotFoundException($"Email của tài khoản này chưa được xác nhận. Vui lòng nhấn quên mật khẩu!");
            }

            //sign in  
            var signInResult = await _signInManager.PasswordSignInAsync(user, password, false, false);
            if (signInResult.Succeeded)
            {
                var roles = await _userManager.GetRolesAsync(user);
                List<Claim> authClaims = new List<Claim>();
                authClaims.Add(new Claim(ClaimTypes.Email, user.Email));
                authClaims.Add(new Claim(ClaimTypes.Name, user.UserName));
                authClaims.Add(new Claim("userId", user.Id));

                authClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
                foreach (var item in roles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, item));
                }

                var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecrectKey"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddDays(1),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha512Signature)
                    );


                return new JwtSecurityTokenHandler().WriteToken(token);
            }

            throw new InvalidOperationException("Sai mật khẩu. Vui lòng nhập lại!");
        }

        public async Task<bool> SendEmailConfirmAsync(string username, string callbackUrl)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(username);
                if (user == null)
                {
                    throw new KeyNotFoundException($"Không tìm thấy tên đăng nhập hoặc địa chỉ email '{username}'");
                }
            }
            if (user.LockoutEnd != null && user.LockoutEnd.Value > DateTime.Now)
            {
                throw new KeyNotFoundException($"Tài khoản này hiện tại đang bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ");
            }

            SendMail mail = new SendMail();
            var temp = mail.SendEmailNoBccAsync(user.Email, "Email Xác Nhận Từ Warehouse Bridge",
                "<style>\r\n    body {\r\n      font-family: Arial, sans-serif;\r\n      line-height: 1.5;\r\n    }\r\n    .container {\r\n      max-width: 600px;\r\n      margin: 0 auto;\r\n      padding: 20px;\r\n    }\r\n    h1 {\r\n      color: #333;\r\n    }\r\n    p {\r\n      margin-bottom: 20px;\r\n    }\r\n    .button {\r\n      display: inline-block;\r\n      background-color: #007bff;\r\n      color: #fff;\r\n      padding: 10px 20px;\r\n      text-decoration: none;\r\n      border-radius: 5px;\r\n    }\r\n  </style>\r\n  <div class=\"container\">\r\n    <h1>Xác nhận địa chỉ email từ Warehouse Brigde</h1>\r\n    <p>Chúng tôi xác nhận rằng chúng tôi đã nhận được yêu cầu của bạn để xác nhận địa chỉ email của bạn tại Warehouse Bridge. Để hoàn tất quá trình xác nhận, vui lòng nhấp vào liên kết dưới đây hoặc sao chép và dán nó vào trình duyệt của bạn::</p>\r\n   " + $" <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>Link xác nhân địa chỉ Email</a>" + "    <p>Vui lòng lưu ý rằng đường dẫn xác nhận sẽ chỉ có hiệu lực trong vòng 30 phút. Sau thời gian đó, đường dẫn sẽ hết hiệu lực và bạn sẽ cần yêu cầu xác nhận lại.</p>\r\n    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này. Đây là một bức email tự động và không yêu cầu phản hồi.</p>\r\n    <p>Xin chân thành cảm ơn vì sự hợp tác của bạn.</p>\r\n   "
              );
            if (temp == true)
            {
                return true;
            }
            else
            {
                return false;

            }

        }

    }
}
