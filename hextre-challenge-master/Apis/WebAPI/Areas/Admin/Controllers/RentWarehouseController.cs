using Application.Interfaces;
using Infrastructures;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("Admin/api/[controller]")]
    [ApiController]
    public class RentWarehouseController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IClaimsService _claimsService;

        public RentWarehouseController(AppDbContext context, IClaimsService claimsService)
        {
            _context = context;
            _claimsService = claimsService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
           
            var list = await _context.RentWarehouse.Where(x => x.IsDeleted == false ).ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var list = await _context.RentWarehouse.FirstOrDefaultAsync(x => x.IsDeleted == false && x.Id == id);

            return Ok(list);
        }

    }
}
