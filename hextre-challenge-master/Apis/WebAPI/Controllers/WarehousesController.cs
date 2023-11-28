using Application.ViewModels.WarehouseViewModel;
using AutoMapper;
using Infrastructures;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehousesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public WarehousesController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        // GET: api/Warehouses
        [HttpGet]
        public async Task<IActionResult> GetWarehouse()
        {
            var warehouse = await _context.Warehouse.AsNoTracking().Include(w => w.Category).Include(w => w.Provider).Include(w => w.ImageWarehouses).Where(x => x.IsDeleted == false && x.IsDisplay == true).ToListAsync();
            var result = _mapper.Map<IList<WarehouseViewModel>>(warehouse);
            return Ok(result);
        }

        [HttpGet("Search")]
        public async Task<IActionResult> SearchWarehouse(string keyword)
        {
            var warehouse = await _context.Warehouse.AsNoTracking().Where(x => x.IsDeleted == false && x.IsDisplay == true && x.Name.ToLower().Contains(keyword.ToLower())).ToListAsync();
            var result = _mapper.Map<IList<WarehouseViewModel>>(warehouse);
            return Ok(result);
        }

        // GET: api/Warehouses/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetWarehouse(Guid id)
        {
            if (_context.Provider == null)
            {
                return NotFound();
            }
            var warehouse = await _context.Warehouse.AsNoTracking().Include(x => x.ImageWarehouses.Where(c => c.IsDeleted == false)).Include(x => x.WarehouseDetails.Where(c => c.IsDeleted == false)).SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false && x.IsDisplay == true);

            if (warehouse == null)
            {
                return NotFound("Không tìm thấy kho chứa bạn yêu cầu!");
            }
            var result = _mapper.Map<WarehouseViewModel>(warehouse);
            return Ok(result);
        }


        [HttpGet("GetWarehouseByProvider/{id}")]
        public async Task<IActionResult> GetWarehouseByProvider(Guid id)
        {
            var providers = await _context.Provider.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false );

            if (providers == null)
            {
                return NotFound("Không tìm thấy đối tác bạn yêu cầu!");
            }
            var warehouse = await _context.Warehouse.AsNoTracking().Include(i => i.ImageWarehouses).Where(x => x.IsDeleted == false && x.ProviderId == id && x.IsDisplay == true).ToListAsync();
            var result = _mapper.Map<IList<WarehouseViewModel>>(warehouse);
            return Ok(result);
        }

        [HttpGet("GetWarehouseByCategory/{id}")]
        public async Task<IActionResult> GetWarehouseByCategory(Guid id)
        {
            var cate = await _context.Category.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);

            if (cate == null)
            {
                return NotFound("Không tìm thấy danh mục kho bạn yêu cầu!");
            }
            var warehouse = await _context.Warehouse.AsNoTracking().Include(w => w.Category).Include(w => w.Provider).Include(w => w.ImageWarehouses).Where(x => x.IsDeleted == false && x.CategoryId == id && x.IsDisplay == true).ToListAsync();
            var result = _mapper.Map<IList<WarehouseViewModel>>(warehouse);
            return Ok(result);
        }
    }
}
