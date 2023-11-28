using Application.ViewModels.CategoryViewModels;
using AutoMapper;
using Domain.Entities;
using Infrastructures;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CategoriesController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetCategory()
        {
            var categories = await _context.Category.AsNoTracking().Where(x => x.IsDeleted == false ).ToListAsync();
            var result = _mapper.Map<IList<CategoryViewModel>>(categories);
            return Ok(result);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(Guid id)
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
            return category;
        }
    }
}
