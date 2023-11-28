using Application.Interfaces;
using Application.ViewModels.HashtagViewModels;
using Application.ViewModels.ProviderViewModels;
using Infrastructures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HashtagController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHashtagService _hashtagService;

        public HashtagController(AppDbContext context ,IHashtagService hashtagService)
        {
            _hashtagService = hashtagService;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetHashtag()
        {
            var result = await _hashtagService.GetHashtag();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHashtagById(Guid id)
        {
            var result = await _hashtagService.GetById(id);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> PostHashtag(CreateHashtagViewModel createHashtagView)
        {
            try
            {
                var result = await _hashtagService.CreateHashtag(createHashtagView);
                return Ok(new {
                    Result = "Create successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateHashtag(UpdateHashtagViewModel updateHashtagView)
        {
            try
            {
                var result = _hashtagService.UpdateHashtag(updateHashtagView);
                return Ok(new
                {
                    Result = "Update successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> DeleteHashtag(Guid id)
        {
            try
            {
                var result = await _hashtagService.DeleteHashtag(id);

                return Ok(new { 
                    Reuslt = "Delete successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
