using Application.ViewModels;
using Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnumController : ControllerBase
    {
        [HttpGet("ContractStatus")]
        public async Task<IActionResult> ContractStatus()
        {
            List<EnumModel> enums = ((ContractStatus[])Enum.GetValues(typeof(ContractStatus))).Select(c => new EnumModel() { Value = (int)c, Display = c.ToString() }).ToList();
            return Ok(enums);
        }

        [HttpGet("DepositStatus")]
        public async Task<IActionResult> DepositStatus()
        {
            List<EnumModel> enums = ((DepositStatus[])Enum.GetValues(typeof(DepositStatus))).Select(c => new EnumModel() { Value = (int)c, Display = c.ToString() }).ToList();
            return Ok(enums);
        }
        [HttpGet("GoodUnit")]
        public async Task<IActionResult> GoodUnit()
        {
            List<EnumModel> enums = ((GoodUnit[])Enum.GetValues(typeof(GoodUnit))).Select(c => new EnumModel() { Value = (int)c, Display = c.ToString() }).ToList();
            return Ok(enums);
        }

        [HttpGet("OrderStatus")]
        public async Task<IActionResult> OrderStatus()
        {
            List<EnumModel> enums = ((OrderStatus[])Enum.GetValues(typeof(OrderStatus))).Select(c => new EnumModel() { Value = (int)c, Display = c.ToString() }).ToList();
            return Ok(enums);
        }
        [HttpGet("PaymentStatus")]
        public async Task<IActionResult> PaymentStatus()
        {
            List<EnumModel> enums = ((PaymentStatus[])Enum.GetValues(typeof(PaymentStatus))).Select(c => new EnumModel() { Value = (int)c, Display = c.ToString() }).ToList();
            return Ok(enums);
        }

        [HttpGet("PaymentType")]
        public async Task<IActionResult> PaymentType()
        {
            List<EnumModel> enums = ((PaymentType[])Enum.GetValues(typeof(PaymentType))).Select(c => new EnumModel() { Value = (int)c, Display = c.ToString() }).ToList();
            return Ok(enums);
        }

        [HttpGet("RentStatus")]
        public async Task<IActionResult> RentStatus()
        {
            List<EnumModel> enums = ((RentStatus[])Enum.GetValues(typeof(RentStatus))).Select(c => new EnumModel() { Value = (int)c, Display = c.ToString() }).ToList();
            return Ok(enums);
        }
        [HttpGet("RequestType")]
        public async Task<IActionResult> RequestType()
        {
            List<EnumModel> enums = ((RequestType[])Enum.GetValues(typeof(RequestType))).Select(c => new EnumModel() { Value = (int)c, Display = c.ToString() }).ToList();
            return Ok(enums);
        }

        [HttpGet("UnitType")]
        public async Task<IActionResult> UnitType()
        {
            List<EnumModel> enums = ((UnitType[])Enum.GetValues(typeof(UnitType))).Select(c => new EnumModel() { Value = (int)c, Display = c.ToString() }).ToList();
            return Ok(enums);
        }

        [HttpGet("Requeststatus")]
        public async Task<IActionResult> Requeststatus()
        {
            List<EnumModel> enums = ((RequestStatus[])Enum.GetValues(typeof(RequestStatus))).Select(c => new EnumModel() { Value = (int)c, Display = c.ToString() }).ToList();
            return Ok(enums);
        }
    }
}
