using Application.ViewModels;
using Application.ViewModels.AuthViewModel;
using Application.ViewModels.UserViewModels;
using Domain.Entities;
using Infrastructures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using WebAPI.Validations.Auth;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _dbContext;

        public UserController(UserManager<ApplicationUser> userManager,AppDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        [HttpGet("GetListUser")]
        public async Task<IActionResult> GetListUser()
        {
            var list = await _userManager.GetUsersInRoleAsync("Customer");
            return Ok(list);
        }

        [HttpGet("GetListStaff")]
        public async Task<IActionResult> GetListStaff()
        {
            var list = await _userManager.GetUsersInRoleAsync("Staff");
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) {
                return BadRequest("Không tìm thấy người dùng bạn yêu cầu!");
            }
            return Ok(user);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UserUpdateModel model)
        {

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return BadRequest("Không tìm thấy người dùng bạn yêu cầu!");
            }
            try
            {
                var emailUser = await _userManager.FindByEmailAsync(model.Email);
                if (emailUser != null)
                {
                    return BadRequest("Email này đã được sử dụng cho tài khoản khác");
                }
                var username = await _userManager.FindByNameAsync(model.Username);
                if (username != null)
                {
                    return BadRequest("Tên đăng nhập này đã được sử dụng cho tài khoản khác");
                }
                user.Fullname = model.Fullname;
                user.Email = model.Email;
                user.NormalizedEmail = model.Email.ToUpper();
                user.Avatar = model.Avatar;
                user.Address = model.Address;
                user.PhoneNumber = model.PhoneNumber;
                user.Birthday = model.Birthday;
                user.UserName = model.Username;
                user.NormalizedUserName = model.Username.ToUpper();
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok(user);
        }

        [HttpPost("CreateStaffAccount")]
        public async Task<IActionResult> CreateStaffAccount(RegisterModel model)
        {
            var validator = new RegisterModelValidator();
            var result = validator.Validate(model);
            if (result.IsValid)
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

                var tempResult = await _userManager.CreateAsync(user, model.Password);
                if (tempResult.Succeeded)
                {
                    var temp = await _userManager.FindByEmailAsync(model.Email);
                    var addRoleResult = await _userManager.AddToRoleAsync(user, "Staff");
                    if (addRoleResult.Succeeded)
                    {
                        return Ok("Tạo tài khoản nhân viên thành công!");
                    }
                    else
                    {
                        await _userManager.DeleteAsync(user);
                        throw new Exception("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại!");
                    }
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            else
            {

                ErrorViewModel errors = new ErrorViewModel();
                errors.Errors = new List<string>();
                errors.Errors.AddRange(result.Errors.Select(x => x.ErrorMessage));
                return BadRequest(errors);
            }

        }


        /*[HttpPut("ResetPass/{id}")]
        public async Task<IActionResult> ResetPass(string id, string newPass)
        {

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return BadRequest("Không tìm thấy người dùng bạn yêu cầu!");
            }
            try
            {
                user.Fullname = model.Fullname;
                user.Email = model.Email;
                user.NormalizedEmail = model.Email.ToUpper();
                user.Avatar = model.Avatar;
                user.Address = model.Address;
                user.PhoneNumber = model.PhoneNumber;
                user.Birthday = model.Birthday;
                user.UserName = model.Username;
                user.NormalizedUserName = model.Username.ToUpper();
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok(user);
        }*/
    }
}
