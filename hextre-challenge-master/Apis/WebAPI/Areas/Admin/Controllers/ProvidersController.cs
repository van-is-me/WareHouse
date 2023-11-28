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
using AutoMapper;
using Application.ViewModels.ProviderViewModels;
using WebAPI.Validations.Providers;
using Application.ViewModels;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("Admin/api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff")]
    public class ProvidersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ProvidersController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetProvider()
        {
            var providers = await _context.Provider.AsNoTracking().Where(x => x.IsDeleted == false).ToListAsync();
            var result = _mapper.Map<IList<ProviderViewModel>>(providers);
            return Ok(result);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProviderViewModel>> GetProvider(Guid id)
        {
            if (_context.Provider == null)
            {
                return NotFound("Không tìm thấy đối tác bạn yêu cầu!");
            }
            var providers = await _context.Provider.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);

            if (providers == null)
            {
                return NotFound("Không tìm thấy đối tác bạn yêu cầu!");
            }
            var result = _mapper.Map<ProviderViewModel>(providers);
            return result;
        }

        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutProvider(UpdateProviderViewModel model)
        {
            if (!ProviderExists(model.Id))
            {
                return NotFound("Không tìm thấy đối tác bạn yêu cầu!");
            }
            if (ProviderDuplicateName(model.Name,model.Id))
            {
                return NotFound("Tên này đã được sử dụng cho đối tác khác!");
            }
            else if (ProviderDuplicateEmail(model.Email, model.Id))
            {
                return NotFound("Email này đã được sử dụng cho đối tác khác!");
            }
            else if (ProviderDuplicatePhone(model.Phone, model.Id))
            {
                return NotFound("Số điện thoại này đã được sử dụng cho đối tác khác!");
            }
            var provider= await _context.Provider.AsNoTracking().SingleOrDefaultAsync(x => x.Id == model.Id && x.IsDeleted == false);
            var validator = new ProviderUpdateValidator();
            var result = validator.Validate(model);
            if (result.IsValid)
            {
                provider = _mapper.Map<Provider>(model);
                _context.Entry(provider).State = EntityState.Modified;

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
            

            return Ok("Cập nhật đối tác thành công!");
        }

        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Category>> PostProvider(CreateProviderViewModel model)
        {
            try
            {
                if (ProviderExistsName(model.Name))
                {
                    return NotFound("Tên đối tác này đã tồn tại!");
                }
                var validator = new ProviderCreateValidator();
                var result = validator.Validate(model);
                if (result.IsValid)
                {
                    var category = _mapper.Map<Provider>(model);
                    _context.Provider.Add(category);
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
            return Ok("Tạo đối tác thành công");
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProvider(Guid id)
        {
            
            var provider = await _context.Provider.Include(x => x.Warehouses.Where(c => c.IsDeleted == false)).AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);
            if (provider == null)
            {
                return NotFound("Không tìm thấy đối tác bạn yêu cầu!");
            }
            else if (provider.Warehouses != null && provider.Warehouses.Count() > 0)
            {
                return NotFound("Đối tác kho bạn yêu cầu hiện đang có các kho bên trong!");
            }
            provider.IsDeleted = true;
            _context.Entry(provider).State = EntityState.Modified;

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

        private bool ProviderExists(Guid id)
        {
            return (_context.Provider?.Any(x => x.Id == id && x.IsDeleted == false)).GetValueOrDefault();
        }

        private bool ProviderExistsName(string name)
        {
            return (_context.Provider?.Any(e => e.Name.ToLower().Equals(name.ToLower()) && e.IsDeleted ==false)).GetValueOrDefault();
        }
        private bool ProviderDuplicateName(string name, Guid id)
        {
            return (_context.Provider?.Any(e => e.Name.ToLower().Equals(name.ToLower()) && e.IsDeleted == false &&  e.Id!=id)).GetValueOrDefault();
        }
        private bool ProviderDuplicateEmail(string email, Guid id)
        {
            return (_context.Provider?.Any(e => e.Email.ToLower().Equals(email.ToLower()) && e.IsDeleted == false && e.Id != id)).GetValueOrDefault();
        }
        private bool ProviderDuplicatePhone(string phone, Guid id)
        {
            return (_context.Provider?.Any(e => e.Phone.ToLower().Equals(phone.ToLower()) && e.IsDeleted == false && e.Id != id)).GetValueOrDefault();
        }
    }
}
