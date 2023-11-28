using Application.ViewModels.ImageWarehouseViewModels;
using AutoMapper;
using Domain.Entities;
using Infrastructures;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageWarehousesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ImageWarehousesController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("GetImageWarehouseByWarehouse/{id}")]
        public async Task<IActionResult> GetImageWarehouseByWarehouse(Guid id)
        {
            var imageWarehouses = await _context.ImageWarehouse.AsNoTracking().Where(x => x.IsDeleted == false && x.WarehouseId == id).ToListAsync();
            var result = _mapper.Map<IList<ImageWarehouseViewModel>>(imageWarehouses);
            return Ok(result);
        }

        // GET: api/ImageWarehouses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ImageWarehouse>> GetImageWarehouse(Guid id)
        {
            if (_context.ImageWarehouse == null)
            {
                return NotFound();
            }
            var image = await _context.ImageWarehouse.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);

            if (image == null)
            {
                return NotFound("Không tìm thấy hình ảnh kho bạn yêu cầu!");
            }
            var result = _mapper.Map<ImageWarehouseViewModel>(image);
            return Ok(result);
        }
    }
}
