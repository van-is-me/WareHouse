using Application.Interfaces;
using Application.Repositories;
using Application;
using Application.Services.Momo;
using AutoMapper;
using Domain.Entities;
using Infrastructures;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IpnController : ControllerBase
    {
        private readonly IUnitOfWork _unit;
        private readonly IOrderService _orderService;
        private readonly IClaimsService _claimsService;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly INoteRepository _noteRepository;
        private readonly IConfiguration _configuration;

        public IpnController(IUnitOfWork unit, IOrderService orderService, IClaimsService claimsService, AppDbContext context, IMapper mapper, INoteRepository noteRepository, IConfiguration configuration)
        {
            _unit = unit;
            _orderService = orderService;
            _claimsService = claimsService;
            _context = context;
            _mapper = mapper;
            _noteRepository = noteRepository;
            _configuration = configuration;
        }
        [HttpPost("IpnHandler")]
        public async Task<IActionResult> IpnHandler([FromBody] MomoRedirect momo)
        {
            var tempPayType = momo.payType;
            if (momo.payType == null)
            {
                tempPayType = "none";
            }

            string endpoint = _configuration["MomoServices:endpoint"];
            string partnerCode = _configuration["MomoServices:partnerCode"];
            string accessKey = _configuration["MomoServices:accessKey"];
            string serectkey = _configuration["MomoServices:serectkey"];
            string redirectUrl = _configuration["MomoServices:redirectUrl"];
            string ipnUrl = _configuration["MomoServices:ipnUrl"];
            try
            {
                DepositPayment deposit = new DepositPayment();
                deposit.OrderId = Guid.Parse(momo.orderId);

                deposit.Amount = momo.amount;
                deposit.IpnURL = ipnUrl;
                deposit.OrderInfo = momo.orderInfo;
                deposit.PartnerCode = partnerCode;
                deposit.RedirectUrl = redirectUrl;
                deposit.RequestId = momo.requestId;
                deposit.RequestType = "captureWallet";
                if (momo.resultCode == 0)
                {
                    deposit.Status = Domain.Enums.DepositStatus.Success;
                }
                else
                {
                    deposit.Status = Domain.Enums.DepositStatus.Failed;
                }

                deposit.PaymentMethod = "Momo";
                deposit.orderIdFormMomo = momo.orderId;
                deposit.orderType = momo.orderType;
                deposit.transId = momo.transId;
                deposit.resultCode = momo.resultCode;
                deposit.message = momo.message;
                deposit.payType = tempPayType;
                deposit.responseTime = momo.responseTime;
                deposit.extraData = momo.extraData;
                deposit.signature = momo.signature;
                await _unit.DepositRepository.AddAsync(deposit);
                await _unit.SaveChangeAsync();

                var order = await _unit.OrderRepository.GetByIdAsync(Guid.Parse(momo.orderId));
                if (momo.resultCode == 0)
                {
                    order.PaymentStatus = Domain.Enums.PaymentStatus.Success;
                    //order.OrderStatus = Domain.Enums.OrderStatus.Processing;
                }
                else
                {
                    order.PaymentStatus = Domain.Enums.PaymentStatus.Fail;
                    var warehouse = await _unit.WarehouseDetailRepository.GetByIdAsync(order.WarehouseDetailId);
                    warehouse.Quantity++;
                    _unit.WarehouseDetailRepository.Update(warehouse);
                    order.OrderStatus = Domain.Enums.OrderStatus.Cancelled;
                }
                _unit.OrderRepository.Update(order);
                await _unit.SaveChangeAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        
        [HttpPost("IpnServiceHandler")]
        public async Task<IActionResult> IpnServiceHandler([FromBody] MomoRedirect momo)
        {
            var tempPayType = momo.payType;
            if (momo.payType == null)
            {
                tempPayType = "none";
            }

            string partnerCode = _configuration["MomoServices:partnerCode"];
            string redirectUrl = _configuration["MomoServices:serviceUrl"];
            string ipnUrl = _configuration["MomoServices:ipnServiceUrl"];
            try
            {
                Transaction deposit = new Transaction();
                deposit.PaymentId = Guid.Parse(momo.orderId);

                deposit.Amount = momo.amount;
                deposit.IpnURL = ipnUrl;
                deposit.Info = momo.orderInfo;
                deposit.PartnerCode = partnerCode;
                deposit.RedirectUrl = redirectUrl;
                deposit.RequestId = momo.requestId;
                deposit.RequestType = "captureWallet";
                if (momo.resultCode == 0)
                {
                    deposit.Status = Domain.Enums.DepositStatus.Success;
                }
                else
                {
                    deposit.Status = Domain.Enums.DepositStatus.Failed;
                }

                deposit.PaymentMethod = "Momo";
                deposit.orderIdFormMomo = momo.orderId;
                deposit.orderType = momo.orderType;
                deposit.transId = momo.transId;
                deposit.resultCode = momo.resultCode;
                deposit.message = momo.message;
                deposit.payType = tempPayType;
                deposit.responseTime = momo.responseTime;
                deposit.extraData = momo.extraData;
                deposit.signature = momo.signature;
                await _unit.TransactionRepository.AddAsync(deposit);
                await _unit.SaveChangeAsync();

                var order = await _context.ServicePayment.AsNoTracking().Where(x => x.Id == Guid.Parse(momo.orderId)).FirstOrDefaultAsync();
                if (momo.resultCode == 0)
                {
                    order.IsPaid = true;
                  
                }
                _context.ServicePayment.Update(order);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
