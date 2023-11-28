using Application.ViewModels.GoodViewModels;
using AutoMapper;
using Domain.Entities;
using Infrastructures;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("Admin/api/[controller]")]
    [ApiController]
    public class GoodController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public GoodController(AppDbContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("{rentWarehouseId}")]
        public async Task<IActionResult> Get(Guid rentWarehouseId)
        {
            var listGood = await _context.Good.Where(x=>x.IsDeleted == false && x.RentWarehouseId == rentWarehouseId).Include(x=>x.GoodImages).ToListAsync();
            if(listGood.Count > 0)
            {
                foreach (var item in listGood)
                {
                    foreach (var item1 in item.GoodImages)
                    {
                        item1.Good = null;
                    }
                }
            }
            var result = _mapper.Map<List<GoodViewModel>>(listGood);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var listGood = await _context.Good.Where(x => x.IsDeleted == false).Include(x => x.GoodImages).ToListAsync();
            if (listGood.Count > 0)
            {
                foreach (var item in listGood)
                {
                    foreach (var item1 in item.GoodImages)
                    {
                        item1.Good = null;
                    }
                }
            }
            var result = _mapper.Map<List<GoodViewModel>>(listGood);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post( [FromBody] GoodCreateWithImage model)
        {
            var myTransaction = await _context.Database.BeginTransactionAsync();
            try
            {

                if (model.Images == null || model.Images.Count == 0)
                {
                    return BadRequest("Vui lòng thêm hình ảnh!");
                }
                var result = _mapper.Map<Good>(model.GoodCreateModel);
                result.GoodCategoryId = Guid.Parse("3963bb64-cd45-4300-9554-4555d55e5054");
                result.ExpirationDate =DateTime.Now;
                var check = await _context.Good.FirstOrDefaultAsync(x => x.RentWarehouseId == model.GoodCreateModel.RentWarehouseId && x.IsDeleted ==false && x.GoodName.ToLower().Equals(model.GoodCreateModel.GoodName.ToLower()));
                if (check != null)
                {
                    return BadRequest("Tên hàng này đã tồn tại!");
                }
                await _context.Good.AddAsync(result);
                await _context.SaveChangesAsync();

                List<GoodImage> images = new List<GoodImage>();
                foreach (var item in model.Images)
                {
                    var goodImage = new GoodImage();
                    goodImage.GoodId = result.Id;
                    goodImage.ImageUrl = item;
                    images.Add(goodImage);
                }

                await _context.GoodImage.AddRangeAsync(images);
                await _context.SaveChangesAsync();
                await myTransaction.CommitAsync();
                return Ok("Tạo hàng trong kho thành công!");
            }
            catch (Exception ex)
            {
                await myTransaction.RollbackAsync();
                return BadRequest(ex.Message);
            }
           
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id,[FromBody] GoodCreateModel model)
        {
            try
            {
                var result = _mapper.Map<Good>(model);
                var good = _context.Good.FirstOrDefaultAsync(x=>x.IsDeleted ==false && x.Id == id);
                if (good == null)
                {
                    return NotFound("Không tìm thấy hàng bạn yêu cầu!");
                }
                var check = await _context.Good.FirstOrDefaultAsync(x => x.RentWarehouseId == model.RentWarehouseId && x.GoodName.ToLower().Equals(model.GoodName.ToLower()) && x.IsDeleted == false && x.Id != id);
                if (check != null)
                {
                    return BadRequest("Tên hàng này đã tồn tại!");
                }
                result.Id= id;
                 _context.Good.Update(result);
                await _context.SaveChangesAsync();
                return Ok("Cập nhật hàng trong kho thành công!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("{rentWarehouseId}/{id}")]
        public async Task<IActionResult> GetById(Guid rentWarehouseId,Guid id)
        {
            var good = await _context.Good.Include(x => x.GoodImages).FirstOrDefaultAsync(x => x.IsDeleted == false && x.RentWarehouseId == rentWarehouseId && x.Id == id);
            if(good == null)
            {
                return BadRequest("Không tìm thấy hàng bạn yêu cầu!");
            }
            if (good.GoodImages.Count > 0)
            {
                    foreach (var item1 in good.GoodImages)
                    {
                        item1.Good = null;
                    }

            }
            var result = _mapper.Map<GoodViewModel>(good);
            return Ok(result);
        }

        [HttpDelete("{rentWarehouseId}/{id}")]
        public async Task<IActionResult> Delete(Guid rentWarehouseId, Guid id)
        {
            try
            {
                var good = await _context.Good.AsNoTracking().FirstOrDefaultAsync(x => x.IsDeleted == false && x.RentWarehouseId == rentWarehouseId && x.Id == id);
                if (good == null)
                {
                    return BadRequest("Không tìm thấy hàng bạn yêu cầu!");
                }
                good.IsDeleted = true;
                _context.Update(good);
                await _context.SaveChangesAsync();
                return Ok("Xóa hàng trong kho thành công!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }




    }
}
