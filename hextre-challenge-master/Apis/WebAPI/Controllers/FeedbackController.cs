using Application.Interfaces;
using Application.ViewModels;
using Application.ViewModels.FeedbackViewModels;
using Domain.Entities;
using Infrastructures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Services;
using WebAPI.Validations.Feedbacks;
using WebAPI.Validations.Warehouses;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class FeedbackController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IClaimsService _claimsService;
        private readonly UserManager<ApplicationUser> _userManager;

        public FeedbackController(AppDbContext dbContext,IClaimsService claimsService,UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _claimsService = claimsService;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get() {
            var list = await _dbContext.Feedback.Include(x=>x.ApplicationUser).Where(x => x.IsDeleted == false).OrderByDescending(x => x.CreationDate).ToListAsync();
            return Ok(list);
        }

        [HttpGet("{warehouseId}")]
        public async Task<IActionResult> Get(Guid warehouseId)
        {
            var list = await _dbContext.Feedback.Include(x => x.ApplicationUser).Where(x => x.IsDeleted == false && x.WarehouseId == warehouseId).OrderByDescending(x => x.CreationDate).ToListAsync();
            foreach (var item in list)
            {
                item.ApplicationUser.Feedbacks = null;
            }
            return Ok(list);
        }

        [HttpPost("{warehouseId}")]
        [Authorize(Roles ="Customer")]
        public async Task<IActionResult> Post(Guid warehouseId,FeedbackCreateModel model)
        {
            var userId = _claimsService.GetCurrentUserId.ToString().ToLower();
            var order = await _dbContext.Order.Include(x => x.WarehouseDetail).Where(x => x.WarehouseDetail.WarehouseId == warehouseId && x.IsDeleted == false && x.OrderStatus == Domain.Enums.OrderStatus.Complete).ToListAsync();
            if(order ==null ||order.Count == 0)
            {
                return BadRequest("Vui lòng đặt kho và hoàn thành quá trình thanh toán và ký hợp đồng trước khi gửi đánh giá!");
            }
            var validator = new FeedbackCreateValidator();
            var result = validator.Validate(model);
            if (result.IsValid)
            {
                var feedback = new Feedback();
                feedback.CustomerId = userId;
                feedback.FeedbackText = model.FeedbackText;
                feedback.Rating = model.Rating;
                feedback.WarehouseId = warehouseId;
                await _dbContext.Feedback.AddAsync(feedback);
                await _dbContext.SaveChangesAsync();
                return Ok("Đánh giá thành công!");
            }
            else
            {
                ErrorViewModel errors = new ErrorViewModel();
                errors.Errors = new List<string>();
                errors.Errors.AddRange(result.Errors.Select(x => x.ErrorMessage));
                return BadRequest(errors);
            }
        }
    }
}
