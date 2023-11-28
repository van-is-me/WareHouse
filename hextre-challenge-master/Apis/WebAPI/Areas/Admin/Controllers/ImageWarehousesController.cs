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
using Application.ViewModels.WarehouseViewModel;
using Application.ViewModels.ImageWarehouseViewModels;
using Application.ViewModels;
using WebAPI.Validations.Providers;
using WebAPI.Validations.ImageWarehouses;
using Application.ViewModels.ProviderViewModels;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("Admin/api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Staff")]
    public class ImageWarehousesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ImageWarehousesController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/ImageWarehouses
        [HttpGet("GetImageWarehouseByWarehouse/{id}")]
        public async Task<IActionResult> GetImageWarehouseByWarehouse(Guid id)
        {
            var imageWarehouses = await _context.ImageWarehouse.AsNoTracking().Where(x => x.IsDeleted == false && x.WarehouseId ==id).ToListAsync();
            var result = _mapper.Map<IList<ImageWarehouseViewModel>>(imageWarehouses);
            return Ok(result);
        }

        // GET: api/ImageWarehouses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ImageWarehouse>> GetImageWarehouse(Guid id)
        {
            if (_context.ImageWarehouse == null)
            {
                return NotFound();
            }
            var image = await _context.ImageWarehouse.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);

            if (image == null)
            {
                return NotFound("Không tìm thấy hình ảnh kho bạn yêu cầu!");
            }
            var result = _mapper.Map<ImageWarehouseViewModel>(image);
            return Ok(result);
        }

        // PUT: api/ImageWarehouses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*[HttpPut("{id}")]
        public async Task<IActionResult> PutImageWarehouse(Guid id, ImageWarehouse imageWarehouse)
        {
            if (id != imageWarehouse.Id)
            {
                return BadRequest();
            }

            _context.Entry(imageWarehouse).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImageWarehouseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }*/

        // POST: api/ImageWarehouses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostImageWarehouse(ImageWarehouseCreateModel model)
        {
            try
            {
                var validator = new ImageWarehouseCreateValidator();
                var result = validator.Validate(model);
                if (result.IsValid)
                {
                    var image = _mapper.Map<ImageWarehouse>(model);
                    _context.ImageWarehouse.Add(image);
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
            return Ok("Thêm hình ảnh kho thành công");
        }

        // DELETE: api/ImageWarehouses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImageWarehouse(Guid id)
        {
            var image = await _context.ImageWarehouse.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);
            if (image == null)
            {
                return NotFound("Không tìm thấy hình ảnh bạn yêu cầu!");
            }
            image.IsDeleted = true;
            _context.Entry(image).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            return Ok("Xóa hình ảnh kho thành công!");
        }

    }
}
