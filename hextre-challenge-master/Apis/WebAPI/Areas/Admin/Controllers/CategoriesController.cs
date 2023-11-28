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
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Application;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("Admin/api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unit;

        public CategoriesController(AppDbContext context,IMapper mapper,IUnitOfWork unitOfWork)
        {
            _context = context;
            _mapper = mapper;
            _unit = unitOfWork;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetCategory()
        {
            var categories = await _context.Category.AsNoTracking().Where(x =>x.IsDeleted == false).ToListAsync();
            var result = _mapper.Map<IList<CategoryViewModel>>(categories);
            return Ok(result);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetCategory(Guid id)
        {
            if (_context.Category == null)
            {
                return NotFound();
            }
            var category = await _context.Category.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);

            if (category == null)
            {
                return NotFound("Không tìm thấy danh mục kho bạn yêu cầu!");
            }
            var result = _mapper.Map<CategoryViewModel>(category);
            return Ok(result);
        }

        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutCategory(UpdateCategoryViewModel model)
        {
            if (!CategoryExists(model.Id))
            {
                return NotFound("Không tìm thấy danh mục kho bạn yêu cầu!");
            }
            
            var category = await _context.Category.AsNoTracking().SingleOrDefaultAsync(x => x.Id == model.Id && x.IsDeleted == false);
            category = _mapper.Map<Category>(category);
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            return Ok("Cập nhật danh mục kho thành công!");
        }

        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(CreateCategoryViewModel model)
        {
            try
            {
                if (CategoryExistsName(model.Name))
                {
                    return NotFound("Tên danh mục này đã tồn tại!");
                }
                var category = _mapper.Map<Category>(model);
               await _unit.CategoryRepository.AddAsync(category);
                await _unit.SaveChangeAsync();
                
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
            

            return Ok("Tạo danh mục thành công");
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            if (_context.Category == null)
            {
                return NotFound("Không tìm thấy danh mục kho bạn yêu cầu!");
            }
            var category = await _context.Category.Include(x=>x.Warehouses.Where(c=>c.IsDeleted==false)).AsNoTracking().SingleOrDefaultAsync(x=>x.Id == id && x.IsDeleted == false);
            if (category == null)
            {
                return NotFound("Không tìm thấy danh mục kho bạn yêu cầu!");
            }
            else if(category.Warehouses!=null && category.Warehouses.Count()>0)
            {
                return NotFound("Danh mục kho bạn yêu cầu hiện đang có các kho bên trong!");
            }
            category.IsDeleted = true;
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            return Ok("Xóa danh mục kho thành công!");
        }

        private bool CategoryExists(Guid id)
        {
            var category =  _context.Category.AsNoTracking().SingleOrDefault(x => x.Id == id && x.IsDeleted == false);
            if (category == null)
            {
                return false;
            }
            return true;
        }

        private bool CategoryExistsName(string name)
        {
            return (_context.Category?.Any(e => e.Name.ToLower().Equals(name.ToLower()) && e.IsDeleted == false)).GetValueOrDefault();
        }
    }
}
