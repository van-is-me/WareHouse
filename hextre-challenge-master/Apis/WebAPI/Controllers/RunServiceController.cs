using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RunServiceController : ControllerBase
    {
        private readonly MonthService _service;

        public RunServiceController(MonthService service)
        {
            _service = service;
        }
        //chay bat dau hop dong sau tinh service price
        //update contact in day
        [HttpGet("CalculateServicePayment")]
        public async Task<IActionResult> RunServicePayment()
        {
            RecurringJob.RemoveIfExists("CalculateServicePayment");
            RecurringJob.AddOrUpdate("CalculateServicePayment", () =>  _service.CalculateService(), "10 0 * * *", TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
            return Ok();
        }


        [HttpGet("StartContract")]
        public async Task<IActionResult> StartContract()
        {
            RecurringJob.RemoveIfExists("StartContract");
            RecurringJob.AddOrUpdate("StartContract", () => _service.StartContract(), "30 0 * * *", TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
            return Ok();
        }


        [HttpGet("EndContract")]
        public async Task<IActionResult> EndContract()
        {
            RecurringJob.RemoveIfExists("EndContract");
            RecurringJob.AddOrUpdate("EndContract", () => _service.EndContract(), "0 1 * * *", TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
            return Ok();
        }


    }
}
