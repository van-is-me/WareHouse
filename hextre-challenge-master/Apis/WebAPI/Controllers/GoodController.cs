using Application.Interfaces;
using Application.ViewModels.GoodViewModels;
using AutoMapper;
using Domain.Entities;
using Infrastructures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles ="Customer")]
    public class GoodController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IClaimsService _claims;

        public GoodController(AppDbContext context, IMapper mapper,IClaimsService claims)
        {
            _context = context;
            _mapper = mapper;
            _claims = claims;
        }

        [HttpGet("{rentWarehouseId}")]
        public async Task<IActionResult> Get(Guid rentWarehouseId)
        {
            var userId = _claims.GetCurrentUserId.ToString().ToLower();
            var listGood = await _context.Good.Include(x=>x.RentWarehouse).Where(x => x.RentWarehouse.CustomerId.ToLower().Equals(userId) && x.IsDeleted == false && x.RentWarehouseId == rentWarehouseId).Include(x => x.GoodImages).ToListAsync();
            if (listGood.Count > 0)
            {
                
                foreach (var item in listGood)
                {
                    item.RentWarehouse = null;
                    foreach (var item1 in item.GoodImages)
                    {
                        item1.Good = null;
                    }
                }
            }
            var result = _mapper.Map<List<GoodViewModel>>(listGood);
            return Ok(result);
        }

        [HttpGet("{rentWarehouseId}/{id}")]
        public async Task<IActionResult> GetById(Guid rentWarehouseId, Guid id)
        {
            var userId = _claims.GetCurrentUserId.ToString().ToLower();
            var good = await _context.Good.Include(x=>x.RentWarehouse).Include(x => x.GoodImages)
                .FirstOrDefaultAsync(x => x.RentWarehouse.CustomerId.ToLower().Equals(userId) && x.IsDeleted == false && x.RentWarehouseId == rentWarehouseId && x.Id == id);
            if (good == null)
            {
                return BadRequest("Không tìm thấy hàng bạn yêu cầu!");
            }
            if (good.GoodImages.Count > 0)
            {
                good.RentWarehouse = null;
                foreach (var item1 in good.GoodImages)
                {
                    item1.Good = null;
                }

            }
            var result = _mapper.Map<GoodViewModel>(good);
            return Ok(result);
        }
    }
}
