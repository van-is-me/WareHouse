using Application.Interfaces;
using Application.Services;
using Application.ViewModels.PostViewModels;
using Application.ViewModels.RequestViewModels;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
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
    public class RequestController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IRequestService _requestService;


        public RequestController(AppDbContext context, IMapper mapper, UserManager<ApplicationUser> userManager, IRequestService requestService)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            _requestService = requestService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var list = await _context.Request.Include(x => x.Details).Include(x => x.Customer).Where(x => x.IsDeleted == false).ToListAsync();
            var result = _mapper.Map<List<RequestModel>>(list);
            return Ok(result);
        }

        [HttpGet("rentWareHouse")]
        public async Task<IActionResult> GetRequestById(Guid id)
        {
            var list = await _context.Request
            .Include(x => x.Details)
                .ThenInclude(x => x.Good)
                .ThenInclude(x => x.GoodImages) 
            .Where(x => x.IsDeleted == false && x.Id == id)
            .ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRequest(CreateRequestViewModel createRequestViewModel)
        {
            try
            {
                var result = await _requestService.CreateRequest(createRequestViewModel);
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


        [HttpPost]
        public async Task<IActionResult> CreateRequest(CreateRequestViewModel createRequestViewModel)
        {
            try
            {
                var result = await _requestService.CreateRequest(createRequestViewModel);
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
        public async Task<IActionResult> UpdateRequest(UpdateRequestViewModel updateRequestViewModel)
        {
            try
            {
                var result = await _requestService.UpdateRequest(updateRequestViewModel);
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
        public async Task<IActionResult> DeleteRequest(Guid id)
        {
            try
            {
                var result = await _requestService.DeleteRequest(id);
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
