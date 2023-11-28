using Application.Interfaces;
using Domain.Entities;
using Infrastructures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles ="Customer")]
    public class ServicePaymentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IClaimsService _claims;
        private readonly MonthService _service;

        public ServicePaymentController(AppDbContext context, IClaimsService claims,MonthService service )
        {
            _context = context;
            _claims = claims;
            _service = service;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = _claims.GetCurrentUserId;
            var payments = await _context.ServicePayment.Include(x=>x.Contract).Where(x=>!x.IsDeleted && x.Contract.CustomerId.ToLower().Equals(userId)).ToListAsync();
            foreach (var item in payments)
            {
                item.Contract.ServicePayments = null;
            }
            return Ok(payments);
        }

        [HttpPost]
        public async Task<IActionResult> Payment(Guid servicePaymentId)
        {
            try
            {
                var userId = _claims.GetCurrentUserId;
                var ser =  await _context.ServicePayment.Where(x => !x.IsDeleted && x.Contract.CustomerId.ToLower().Equals(userId) && !x.IsPaid && x.Id == servicePaymentId).FirstOrDefaultAsync();
                if (ser == null)
                {
                    return BadRequest("Không tìm thấy hóa đơn cần thanh toán hoặc bạn không có quyền truy cập vào hóa đơn bạn yêu cầu!");
                }
                var payment = _service.Payment(ser);
                return Ok(payment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



    }
}
