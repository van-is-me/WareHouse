using Application.Interfaces;
using Application.Services;
using Application.ViewModels.RequestDetailViewModel;
using Application.ViewModels.RequestViewModels;
using AutoMapper;
using Domain.Entities;
using Infrastructures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestDetailController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IRequestDetailService _requestDetailService;


        public RequestDetailController(AppDbContext context, IMapper mapper, UserManager<ApplicationUser> userManager, IRequestDetailService requestDetailService)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            _requestDetailService = requestDetailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRequestDetails()
        {
            var result = await _requestDetailService.GetRequestDetails();
            return Ok(result);
        }

        [HttpGet("RequestId")]
        public async Task<IActionResult> GetRequestDetailsByRequestId(Guid id)
        {
            var result = await _context.RequestDetail.Where(x => x.IsDeleted == false && x.RequestId == id).Include(x => x.Good).ToListAsync();
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> CreateRequestDetails(CreateRequestDetailViewModel createRequestDetailViewModel)
        {
            try
            {
                var result = await _requestDetailService.CreateRequestDetails(createRequestDetailViewModel);
                return Ok(new
                {
                    Result = "Tạo thành công."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateRequestDetails(UpdateRequestDetailViewModel updateRequestDetailViewModel)
        {
            try
            {
                var result = await _requestDetailService.UpdateRequestDetails(updateRequestDetailViewModel);
                return Ok(new
                {
                    Reuslt = "Cập nhật thành công."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> DeleteRequestDetails(Guid id)
        {
            try
            {
                var result = await _requestDetailService.DeleteRequestDetail(id);
                return Ok(new
                {
                    Result = "Xoá thành công."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
