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
using Application.ViewModels.WarehouseViewModel;
using Application.ViewModels;
using WebAPI.Validations.Providers;
using WebAPI.Validations.Warehouses;
using Application.ViewModels.ImageWarehouseViewModels;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("Admin/api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff")]
    public class WarehousesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IWarehouseService _service;

        public WarehousesController(AppDbContext context, IMapper mapper,IWarehouseService service)
        {
            _context = context;
            _mapper = mapper;
            _service = service;
        }
        // GET: api/Warehouses
        [HttpGet]
        public async Task<IActionResult> GetWarehouse()
        {
            var warehouse = await _context.Warehouse.AsNoTracking().Where(x => x.IsDeleted == false).ToListAsync();
            var result = _mapper.Map<IList<WarehouseViewModel>>(warehouse);
            return Ok(result);
        }


        [HttpGet("GetWarehouseByProvider/{id}")]
        public async Task<IActionResult> GetWarehouseByProvider(Guid id)
        {
            var providers = await _context.Provider.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);

            if (providers == null)
            {
                return NotFound("Không tìm thấy đối tác bạn yêu cầu!");
            }
            var warehouse = await _context.Warehouse.AsNoTracking().Where(x => x.IsDeleted == false && x.ProviderId == id).ToListAsync();
            var result = _mapper.Map<IList<WarehouseViewModel>>(warehouse);
            return Ok(result);
        }

        [HttpGet("GetWarehouseByCategory/{id}")]
        public async Task<IActionResult> GetWarehouseByCategory(Guid id)
        {
            var cate = await _context.Category.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);

            if (cate == null)
            {
                return NotFound("Không tìm thấy danh mục kho bạn yêu cầu!");
            }
            var warehouse = await _context.Warehouse.AsNoTracking().Where(x => x.IsDeleted == false && x.CategoryId == id).ToListAsync();
            var result = _mapper.Map<IList<WarehouseViewModel>>(warehouse);
            return Ok(result);
        }

        // GET: api/Warehouses/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetWarehouse(Guid id)
        {
            if (_context.Warehouse == null)
            {
                return NotFound("Không tìm thấy kho chứa bạn yêu cầu!");
            }
            var warehouse = await _context.Warehouse.AsNoTracking().Include(x=>x.ImageWarehouses.Where(c=>c.IsDeleted ==false)).Include(x=>x.WarehouseDetails.Where(c=>c.IsDeleted ==false)).SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);

            if (warehouse == null)
            {
                return NotFound("Không tìm thấy kho chứa bạn yêu cầu!");
            }
            var result = _mapper.Map<WarehouseViewModel>(warehouse);
            return Ok(result);
        }

        // PUT: api/Warehouses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutProvider(WarehoureUpdateModel model)
        {
            if (!WarehouseExists(model.Id))
            {
                return NotFound("Không tìm thấy kho chứa bạn yêu cầu!");
            }
            if (WarehouseDuplicateName(model.Name, model.Id))
            {
                return NotFound("Tên này đã được sử dụng cho kho chứa khác!");
            }
           
            var warehouse = await _context.Warehouse.AsNoTracking().SingleOrDefaultAsync(x => x.Id == model.Id && x.IsDeleted == false);
            var validator = new WarehouseUpdateValidator();
            var result = validator.Validate(model);
            if (result.IsValid)
            {
                warehouse = _mapper.Map<Warehouse>(model);
                _context.Entry(warehouse).State = EntityState.Modified;

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


            return Ok("Cập nhật kho chứa thành công!");
        }

        // POST: api/Warehouses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Warehouse>> PostWarehouse(CreateWarehouseAndImageModel model)
        {
            try
            {
                if(model.warehourse ==null|| model.listImages == null)
                {
                    return NotFound("Vui lòng điền đầu đủ thông tin được yêu cầu!");
                }
                if (WarehouseExistsName(model.warehourse.Name))
                {
                    return NotFound("Tên đối tác này đã tồn tại!");
                }
                
                var validator = new WarehouseCreateValidator();
                var result = validator.Validate(model.warehourse);
                if (result.IsValid)
                {
                    IList<ImageWarehouseCreateModel> list = new List<ImageWarehouseCreateModel>();
                    foreach (var item in model.listImages)
                    {
                        ImageWarehouseCreateModel image = new ImageWarehouseCreateModel();
                        image.ImageURL = item;
                        list.Add(image);
                    }
                    await _service.CreateWarehouseAsync(model.warehourse, list);
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
            return Ok("Tạo kho chứa thành công");
        }

        // DELETE: api/Warehouses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWarehouse(Guid id)
        {
            var warehouse = await _context.Warehouse.Include(x => x.WarehouseDetails.Where(c => c.IsDeleted == false)).AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);
            if (warehouse == null)
            {
                return NotFound("Không tìm thấy kho bạn yêu cầu!");
            }
            else if (warehouse.WarehouseDetails != null && warehouse.WarehouseDetails.Count() > 0)
            {
                return NotFound("Kho bạn yêu cầu hiện đang có các chi tiết nên không thể xóa!");
            }
            warehouse.IsDeleted = true;
            _context.Entry(warehouse).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            return Ok("Xóa đối tác kho thành công!");
        }

        private bool WarehouseExists(Guid id)
        {
            return (_context.Warehouse?.Any(x => x.Id == id && x.IsDeleted == false)).GetValueOrDefault();
        }
        
        private bool WarehouseExistsName(string name)
        {
            return (_context.Warehouse?.Any(e => e.Name.ToLower().Equals(name.ToLower()) && e.IsDeleted == false)).GetValueOrDefault();
        }
        private bool WarehouseDuplicateName(string name, Guid id)
        {
            return (_context.Warehouse?.Any(e => e.Name.ToLower().Equals(name.ToLower()) && e.IsDeleted == false && e.Id != id)).GetValueOrDefault();
        }
        private bool ProviderExists(Guid id)
        {
            return (_context.Provider?.Any(x => x.Id == id && x.IsDeleted == false)).GetValueOrDefault();
        }
    }
}
