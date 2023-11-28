using Application.ViewModels.WarehouseDetailViewModels;
using AutoMapper;
using Infrastructures;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseDetailsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public WarehouseDetailsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetWarehouseDetail()
        {
            var details = await _context.WarehouseDetail.AsNoTracking().Where(x => x.IsDeleted == false && x.IsDisplay ==true).ToListAsync();
            var result = _mapper.Map<IList<WarehouseDetailViewModel>>(details);
            return Ok(result);
        }

        // GET: api/WarehouseDetails
        [HttpGet("GetWarehouseDetailByWarehouse/{id}")]
        public async Task<IActionResult> GetWarehouseDetailByWarehouse(Guid id)
        {
            var details = await _context.WarehouseDetail.AsNoTracking().Where(x => x.IsDeleted == false && x.WarehouseId == id && x.IsDisplay == true).ToListAsync();
            var result = _mapper.Map<IList<WarehouseDetailViewModel>>(details);
            return Ok(result);
        }

        // GET: api/WarehouseDetails/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetWarehouseDetail(Guid id)
        {
            if (_context.WarehouseDetail == null)
            {
                return NotFound("Không tìm thấy chi tiết kho mà bạn yêu cầu!");
            }
            var detail = await _context.WarehouseDetail.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false && x.IsDisplay == true);

            if (detail == null)
            {
                return NotFound("Không tìm thấy chi tiết kho mà bạn yêu cầu!");
            }
            var result = _mapper.Map<WarehouseDetailViewModel>(detail);
            return Ok(result);
        }
    }
}
