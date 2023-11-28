using Application.ViewModels.ProviderViewModels;
using AutoMapper;
using Infrastructures;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProvidersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ProvidersController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetProvider()
        {
            var providers = await _context.Provider.AsNoTracking().Where(x => x.IsDeleted == false && x.IsDisplay == true).ToListAsync();
            var result = _mapper.Map<IList<ProviderViewModel>>(providers);
            return Ok(result);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProviderViewModel>> GetProvider(Guid id)
        {
            if (_context.Provider == null)
            {
                return NotFound();
            }
            var providers = await _context.Provider.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false && x.IsDisplay == true);

            if (providers == null)
            {
                return NotFound("Không tìm thấy đối tác bạn yêu cầu!");
            }
            var result = _mapper.Map<ProviderViewModel>(providers);
            return result;
        }

        [HttpGet("QuantityWarehouses")]
        public async Task<IActionResult> QuantityWarehouses()
        {
            var providers = await _context.Provider.Include(x => x.Warehouses).AsNoTracking().Where(x => x.IsDeleted == false && x.IsDisplay == true).ToListAsync();

            var result = _mapper.Map<IList<ProviderViewModel>>(providers);

            return Ok(result);
        }
    }
}
