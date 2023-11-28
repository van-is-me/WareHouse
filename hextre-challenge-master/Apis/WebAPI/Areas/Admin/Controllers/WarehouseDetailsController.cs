using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Infrastructures;
using AutoMapper;
using Application.ViewModels.ProviderViewModels;
using Application.ViewModels.WarehouseDetailViewModels;
using Application.ViewModels;
using WebAPI.Validations.Providers;
using WebAPI.Validations.WarehouseDetails;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("Admin/api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff")]
    public class WarehouseDetailsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public WarehouseDetailsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/WarehouseDetails
        [HttpGet]
        public async Task<IActionResult> GetWarehouseDetail()
        {
            var details = await _context.WarehouseDetail.AsNoTracking().Where(x => x.IsDeleted == false).ToListAsync();
            var result = _mapper.Map<IList<WarehouseDetailViewModel>>(details);
            return Ok(result);
        }
        
        // GET: api/WarehouseDetails
        [HttpGet("GetWarehouseDetailByWarehouse/{id}")]
        public async Task<IActionResult> GetWarehouseDetailByWarehouse(Guid id)
        {
            var details = await _context.WarehouseDetail.AsNoTracking().Where(x => x.IsDeleted == false && x.WarehouseId == id).ToListAsync();
            var result = _mapper.Map<IList<WarehouseDetailViewModel>>(details);
            return Ok(result);
        }

        // GET: api/WarehouseDetails/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetWarehouseDetail(Guid id)
        {
            if (_context.WarehouseDetail == null)
            {
                return NotFound("Không tìm thấy chi tiết kho mà bạn yêu cầu!");
            }
            var detail = await _context.WarehouseDetail.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);

            if (detail == null)
            {
                return NotFound("Không tìm thấy chi tiết kho mà bạn yêu cầu!");
            }
            var result = _mapper.Map<WarehouseDetailViewModel>(detail);
            return Ok(result);
        }

        // PUT: api/WarehouseDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutWarehouseDetail(WarehouseDetailUpdateModel model)
        {
            if (!WarehouseDetailExists(model.Id))
            {
                return NotFound("Không tìm thấy chi tiết kho mà bạn yêu cầu!");
            }
            
            var detail = await _context.WarehouseDetail.AsNoTracking().SingleOrDefaultAsync(x => x.Id == model.Id && x.IsDeleted == false);
            var validator = new WarehouseDetailUpdateValidator();
            var result = validator.Validate(model);
            if (result.IsValid)
            {
                detail = _mapper.Map<WarehouseDetail>(model);
                _context.Entry(detail).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    return NotFound(ex.Message);
                }
            }
            else
            {
                ErrorViewModel errors = new ErrorViewModel();
                errors.Errors = new List<string>();
                errors.Errors.AddRange(result.Errors.Select(x => x.ErrorMessage));
                return BadRequest(errors);
            }
            return Ok("Cập nhật chi tiết kho chứa thành công!");
        }

        // POST: api/WarehouseDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<WarehouseDetail>> PostWarehouseDetail(WarehouseDetailCreateModel model)
        {
            try
            {
                var validator = new WarehouseDetailCreateValidator();
                var result = validator.Validate(model);
                if (result.IsValid)
                {
                    var warehouseDetail = _mapper.Map<WarehouseDetail>(model);
                    warehouseDetail.IsDisplay = true;
                    _context.WarehouseDetail.Add(warehouseDetail);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    ErrorViewModel errors = new ErrorViewModel();
                    errors.Errors = new List<string>();
                    errors.Errors.AddRange(result.Errors.Select(x => x.ErrorMessage));
                    return BadRequest(errors);
                }

            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
            return Ok("Tạo chi tiết kho thành công");
        }

        // DELETE: api/WarehouseDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWarehouseDetail(Guid id)
        {
            var detail = await _context.WarehouseDetail.AsNoTracking().Include(x=>x.Orders).SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);
            if (detail == null)
            {
                return NotFound("Không tìm thấy chi tiết kho bạn yêu cầu!");
            }
            else if (detail.Orders != null && detail.Orders.Count() > 0)
            {
                return NotFound("Chi tiết kho bạn yêu cầu hiện đang có các kho bên trong!");
            }
            detail.IsDeleted = true;
            _context.Entry(detail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            return Ok("Xóa chi tiết kho thành công!");
        }

        private bool WarehouseDetailExists(Guid id)
        {
            return (_context.WarehouseDetail?.Any(x => x.Id == id && x.IsDeleted == false)).GetValueOrDefault();
        }
    }
}
