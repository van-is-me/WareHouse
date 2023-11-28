using Application.Interfaces;
using Application.ViewModels.PostHashtagViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.FlowAnalysis.DataFlow;
using Org.BouncyCastle.Crypto.Paddings;
using System.Data;
using System.Security.Policy;

namespace WebAPI.Areas.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostHashtagController : ControllerBase
    {
        private readonly IPostHashtagService _postHashtagService;

        public PostHashtagController(IPostHashtagService postHashtagService)
        {
            _postHashtagService = postHashtagService;
        }

        [HttpGet("ListPostAndHashtag")]
        public async Task<IActionResult> GetPostAndHashtag()
        {
            return Ok(await _postHashtagService.GetPostAndHashtag());
        }

        [HttpGet]
        public async Task<IActionResult> GetPostHashtag()
        {
            return Ok(await _postHashtagService.GetPostHashtag());
        }

        
        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> CreatePostHashtag(CreatePostHashtagViewModel createPostHashtagView)
        {
            try
            {
                await _postHashtagService.CreatePostHashtag(createPostHashtagView);
                return Ok("Tạo thành công.");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdatePostHashtag(CreatePostHashtagViewModel hashtagViewModel)
        {
            try
            {
                await _postHashtagService.UpdatePostHashtag(hashtagViewModel);
                return Ok("Cập nhật thành công.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> DeletePostHashtag(Guid id)
        {
            try
            {
                await _postHashtagService.DeletePostHashtag(id);
                return Ok("Xoá thành công.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
