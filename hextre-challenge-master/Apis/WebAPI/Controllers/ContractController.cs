using Application.Interfaces;
using Application.ViewModels.ContractViewModels;
using AutoMapper;
using Infrastructures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class ContractController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IClaimsService _claimsService;

        public ContractController(AppDbContext context, IMapper mapper,IClaimsService claimsService)
        {
            _context = context;
            _mapper = mapper;
            _claimsService = claimsService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = _claimsService.GetCurrentUserId;
            var list = await _context.Contract.Where(x => x.IsDeleted == false && x.CustomerId.ToLower().Equals(userId.ToString().ToLower())).Include(x => x.Customer).Include(x => x.ServicePayments).Include(x => x.RentWarehouse).ToListAsync();
            foreach (var item in list)
            {
                item.Customer.Contracts = null;
                item.ServicePayments = null;
                item.RentWarehouse.Contracts = null;
            }
            var tempList = _mapper.Map<List<ContractModel>>(list);
            return Ok(tempList);
        }

    }
}
