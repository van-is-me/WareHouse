using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Infrastructures;
using Application.ViewModels.CategoryViewModels;
using Application.ViewModels.OrderViewModels;
using AutoMapper;
using Application;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("Admin/api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unit;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrdersController(AppDbContext context, IMapper mapper, IUnitOfWork unit, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _mapper = mapper;
            _unit = unit;
            _userManager = userManager;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult> GetOrder()
        {
            var orders = await _context.Order.AsNoTracking().Include(x => x.Customer).Where(x => x.IsDeleted == false).ToListAsync();
            foreach (var item in orders)
            {
                item.Customer.OrderDetail = null;
            }
            var result = _mapper.Map<IList<OrderViewModel>>(orders);
            return Ok(result);
        }

        [HttpGet("Filter")]
        public async Task<ActionResult> OrderFilter(OrderStatus orderStatus)
        {
            var orders = await _context.Order.AsNoTracking().Include(x=>x.Customer).Where(x => x.IsDeleted == false && x.OrderStatus == orderStatus).ToListAsync();
            foreach (var item in orders)
            {
                item.Customer.OrderDetail = null;
            }
            var result = _mapper.Map<IList<OrderViewModel>>(orders);
            return Ok(result);
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetOrder(Guid id)
        {
            if (_context.Order == null)
            {
                return NotFound();
            }
            var category = await _context.Order.AsNoTracking().Include(x => x.Customer).SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);
            
            if (category == null)
            {
                return NotFound("Không tìm thấy đơn hàng bạn yêu cầu!");
            }
            category.Customer.OrderDetail = null;
            var result = _mapper.Map<OrderViewModel>(category);
            return Ok(result);
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("UpdateCall/{id}")]
        public async Task<IActionResult> UpdateCall(Guid id)
        {
            var order = await _unit.OrderRepository.GetByIdAsync(id);
            if(order == null)
            {
                return NotFound("Không tìm thấy đơn hàng mà bạn yêu cầu!");
            }
            else
            {
                try
                {
                    order.TotalCall++;
                    order.ContactInDay = true;
                    _unit.OrderRepository.Update(order);
                    await _unit.SaveChangeAsync();
                    return Ok("Cập nhật đơn hàng thành công!");
                }
                catch (Exception ex)
                {
                    return NotFound("Đã có lỗi xảy ra trong quá trình cập nhật đơn hàng!");
                }
            }
        }

        [HttpPut("AssignOrder/{id}")]
        public async Task<IActionResult> AssignOrder(Guid id, string StaffId)
        {
            var order = await _unit.OrderRepository.GetByIdAsync(id);
           
            if (order == null)
            {
                return NotFound("Không tìm thấy đơn hàng mà bạn yêu cầu!");
            }
            else
            {
                try
                {
                    var staff = await _userManager.FindByIdAsync(StaffId);
                    if (staff == null)
                    {
                        NotFound("Không tìm thấy nhân viên mà bạn yêu cầu!");
                    }
                    if (await _userManager.IsInRoleAsync(staff, "Staff"))
                    {
                        order.DeleteBy = Guid.Parse(StaffId);
                        _unit.OrderRepository.Update(order);
                        await _unit.SaveChangeAsync();

                    }
                    else
                    {
                        NotFound("Không phải nhân viên!");
                    }
                    return Ok("Giao đơn hàng cho nhân viên thành công!");


                }
                catch (Exception ex)
                {
                    return NotFound("Đã có lỗi xảy ra trong quá trình cập nhật đơn hàng!");
                }
            }
        }


        [HttpPut("UpdateStatus")]
        public async Task<IActionResult> UpdateStatus(UpdateOrderStatusModel model)
        {
            var order = await _unit.OrderRepository.GetByIdAsync(model.Id);
            if (order == null)
            {
                return NotFound("Không tìm thấy đơn hàng mà bạn yêu cầu!");
            }else if (model.PickupDay != null && model.PickupDay < DateTime.Now)
            {

                return NotFound("Ngày vận chuyển không thể nhỏ hơn ngày hiện tại!");
            }
            else
            {
                try
                {
                    order.OrderStatus = model.OrderStatus;
                    order.DeletionDate = model.PickupDay;
                    _unit.OrderRepository.Update(order);
                    await _unit.SaveChangeAsync();
                    return Ok("Cập nhật đơn hàng thành công!");
                }
                catch (Exception ex)
                {
                    return NotFound("Đã có lỗi xảy ra trong quá trình cập nhật đơn hàng!");
                }
            }
        }

        

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*[HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
          if (_context.Order == null)
          {
              return Problem("Entity set 'AppDbContext.Order'  is null.");
          }
            _context.Order.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.Id }, order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(Guid id)
        {
            if (_context.Order == null)
            {
                return NotFound();
            }
            var order = await _context.Order.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Order.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(Guid id)
        {
            return (_context.Order?.Any(e => e.Id == id)).GetValueOrDefault();
        }*/
    }
}
