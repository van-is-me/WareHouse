using Application;
using Application.ViewModels.OrderViewModels;
using AutoMapper;
using Infrastructures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("Admin/api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff")]
    public class DepositController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unit;

        public DepositController(AppDbContext context, IMapper mapper, IUnitOfWork unit)
        {
            _context = context;
            _mapper = mapper;
            _unit = unit;
        }
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var orders = await _context.DepositPayments.AsNoTracking().Where(x => x.IsDeleted == false).ToListAsync();
            return Ok(orders);
        }
    }
}
