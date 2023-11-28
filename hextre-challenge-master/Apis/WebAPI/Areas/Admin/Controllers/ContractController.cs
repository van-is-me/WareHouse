using Application.ViewModels.ContractViewModels;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Infrastructures;
using MailKit.Search;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Areas.Admin.Controllers
{
    //[Authorize(Roles = "Admin,Staff")]
    [Route("Admin/api/[controller]")]
    [ApiController]
    public class ContractController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ContractController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var list = await _context.Contract.Where(x => x.IsDeleted == false).Include(x => x.Customer).Include(x => x.ServicePayments).Include(x => x.RentWarehouse).ToListAsync();
            foreach (var item in list)
            {
                item.Customer.Contracts = null;
                item.ServicePayments = null;
                item.RentWarehouse.Contracts = null;
            }
            var tempList = _mapper.Map<List<ContractModel>>(list);
            return Ok(tempList);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ContractViewModel model)
        {
            var myTransaction = _context.Database.BeginTransaction();
            try
            {
                Guid rentWarehiuse = await CreateRenthouse(model.OrderId);
                await CreateContract(model, rentWarehiuse);
                myTransaction.Commit();
                return Ok("Tạo hợp đồng thành công!");
            }
            catch (Exception ex)
            {
                myTransaction.Rollback();
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put([FromBody] ContractUpdateModel model, Guid id)
        {
            try
            {
                var contract = await _context.Contract.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && x.IsDeleted == false && x.ContractStatus == ContractStatus.Pending && x.EndTime > DateTime.Now);
                if (contract == null)
                {
                    return BadRequest("Không tìm thấy hợp đồng bạn yêu cầu hoặc hợp đồng này đã hết hạn!");
                }
                contract.StartTime = model.StartTime;
                contract.EndTime = model.EndTime;
                if (model.StartTime < DateTime.Now || model.EndTime < DateTime.Now)
                {
                    throw new Exception("Ngày bắt đầu hoặc ngày kết thúc hợp đồng phải lớn hơn ngày hiện tại");
                }
                else if (model.EndTime < model.StartTime || model.StartTime.AddMonths(6) > model.EndTime)
                {
                    throw new Exception("Ngày kết thúc hợp đồng phải sau ngày bắt đầu ít nhất 6 tháng!");

                }
                contract.File = model.File;
                contract.Description = model.Description;
                _context.Contract.Update(contract);

                await _context.SaveChangesAsync();
                return Ok("Cập nhật thông tin hợp đồng thành công!");
            }
            catch (Exception ex)
            {

                return BadRequest("Đã xảy ra lỗi!");
            }
        }

        [NonAction]
        public async Task<Guid> CreateRenthouse(Guid orderId)
        {
            var order = await _context.Order.AsNoTracking().FirstOrDefaultAsync(x => x.IsDeleted == false && x.Id == orderId && x.OrderStatus == Domain.Enums.OrderStatus.Processing && x.PaymentStatus == PaymentStatus.Success);
            if (order == null)
            {
                throw new Exception("Không tìm thấy đơn hàng bạn yêu cầu hoặc đơn hàng chưa được hoàn thành việc thanh toán!");
            }
            if (order.DeleteBy == null)
            {
                throw new Exception("Đơn hàng này chưa được giao cho nhân viên quản lý!");
            }
            var temp = await _context.RentWarehouse.Where(x => x.IsDeleted == false && x.CustomerId == order.CustomerId).ToListAsync();
            string name = "Kho " + temp.Count();
            var rentwarehouse = new RentWarehouse();
            rentwarehouse.CustomerId = order.CustomerId;
            rentwarehouse.StaffId = order.DeleteBy.ToString().ToLower();
            rentwarehouse.Information = name;
            rentwarehouse.RentStatus = Domain.Enums.RentStatus.Pending;
            await _context.RentWarehouse.AddAsync(rentwarehouse);

            await _context.SaveChangesAsync();
            return rentwarehouse.Id;
        }

        [NonAction]
        public async Task CreateContract(ContractViewModel model, Guid rentwarehouse)
        {
            var order = await _context.Order.Include(x => x.WarehouseDetail).ThenInclude(x => x.Warehouse).AsNoTracking().FirstOrDefaultAsync(x => x.IsDeleted == false && x.PaymentStatus == PaymentStatus.Success && x.Id == model.OrderId && x.OrderStatus == Domain.Enums.OrderStatus.Processing);
            if (order == null)
            {
                throw new Exception("Không tìm thấy đơn hàng bạn yêu cầu!");
            }
            if (order.DeleteBy == null)
            {
                throw new Exception("Đơn hàng này chưa được giao cho nhân viên quản lý!");
            }
            if (model.StartTime < DateTime.Now || model.EndTime < DateTime.Now)
            {
                throw new Exception("Ngày bắt đầu hoặc ngày kết thúc hợp đồng phải lớn hơn ngày hiện tại");
            }
            else if (model.EndTime < model.StartTime || model.StartTime.AddMonths(6) > model.EndTime)
            {
                throw new Exception("Ngày kết thúc hợp đồng phải sau ngày bắt đầu ít nhất 6 tháng!");

            }
            var contract = new Contract();
            contract.CustomerId = order.CustomerId;
            contract.RentWarehouseId = rentwarehouse;
            contract.StaffId = order.DeleteBy.ToString().ToLower();
            contract.OrderId = order.Id;
            contract.ProviderId = order.WarehouseDetail.Warehouse.ProviderId;
            contract.StartTime = model.StartTime;
            contract.EndTime = model.EndTime;
            contract.File = model.File;
            contract.Description = model.Description;

            contract.ServicePrice = order.ServicePrice;
            contract.WarehousePrice = order.WarehousePrice;
            contract.DepositFee = order.Deposit;
            contract.ContractStatus = ContractStatus.Pending;

            await _context.Contract.AddAsync(contract);
            await _context.SaveChangesAsync();
            order.OrderStatus = OrderStatus.Complete;
            _context.Order.Update(order);
            await _context.SaveChangesAsync();

        }
    }


}
