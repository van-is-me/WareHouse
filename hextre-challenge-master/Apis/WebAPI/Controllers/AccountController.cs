using Application.Interfaces;
using Application.ViewModels;
using Application.ViewModels.AuthViewModel;
using AutoMapper;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebAPI.Validations.Auth;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
        private readonly IAuthorizationService _authorizationService;
        private readonly IConfiguration _configuration;
        public readonly IWebHostEnvironment _environment;
        public readonly IMapper _mapper;
        private readonly IClaimsService _claims;

        public AccountController(UserManager<ApplicationUser> userManager,
             SignInManager<ApplicationUser> signInManager,
            IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
            IAuthorizationService authorizationService,
            IConfiguration configuration,
            IWebHostEnvironment environment,
            IMapper mapper,IClaimsService claims)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
            _authorizationService = authorizationService;
            _configuration = configuration;
            _environment = environment;
            _mapper = mapper;
            _claims = claims;
        }

        [HttpGet("GetInfor")]
        public async Task<IActionResult> GetInfor()
        {
            string userId =  _claims.GetCurrentUserId.ToString().ToLower();
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng bạn yêu cầu!");
            }
            else
            {
                return Ok(user);
            }
        }

        [HttpPut]
        [Route("/UpdateInfo")]
        public async Task<IActionResult> UpdateInfo(UpdateAuthViewModel userViewModel)
        {
            try
            {
                var validator = new UpdateAuthModelValidator();
                var result = validator.Validate(userViewModel);
                if (result.IsValid)
                {

                    string userId = _claims.GetCurrentUserId.ToString().ToLower();
                    var user = await _userManager.FindByIdAsync(userId);
                    var existUsernameUser = await _userManager.Users.AsNoTracking().Where(x => x.UserName.ToLower().Equals(userViewModel.UserName.ToLower()) && !x.Id.ToLower().Equals(userId)).FirstOrDefaultAsync();

                    if (existUsernameUser != null)
                    {
                        return NotFound("Tên đăng nhập này đã tồn tại");
                    }

                    var existEmailUser = await _userManager.Users.AsNoTracking().Where(x=>x.Email.ToLower().Equals(userViewModel.Email.ToLower())  && !x.Id.ToLower().Equals(userId)).FirstOrDefaultAsync();

                    if (existEmailUser != null)
                    {
                        return NotFound("Emai này đã tồn tại");
                    }


                    await _userManager.UpdateAsync(_mapper.Map(userViewModel, user));

                    return Ok("Cập nhật tài khoản thành công");
                }
                else
                {
                    ErrorViewModel errors = new ErrorViewModel();
                    errors.Errors = new List<string>();
                    errors.Errors.AddRange(result.Errors.Select(x => x.ErrorMessage));
                    return BadRequest(errors);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPut]
        [Route("/UpdatePassword")]
        public async Task<IActionResult> UpdatePassword(string pass, string confirmPass)
        {
            try
            {
                if (pass is null) throw new Exception("Mật khẩu không được để trống.");

                if (pass.Length > 50) throw new Exception("Mật khẩu không quá 50 ký tự.");

                if (!pass.Equals(confirmPass)) throw new Exception("Mật khẩu không khớp");

                string userId = _claims.GetCurrentUserId.ToString().ToLower();
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return NotFound("Không tìm thấy người dùng");
                }

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                return Ok(await _userManager.ResetPasswordAsync(user, token, pass));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
