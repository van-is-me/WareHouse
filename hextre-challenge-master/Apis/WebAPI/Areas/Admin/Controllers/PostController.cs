using Application.Interfaces;
using Application.Services;
using Application.ViewModels.PostViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Pkcs;

namespace WebAPI.Areas.Admin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;
        public PostController(IPostService postService)
        { 
            _postService = postService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPost()
        {
            var result = await _postService.GetPost();
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> CreatePost(CreatePostViewModel createPostViewModel)
        {
            try
            {
                var result = await _postService.CreatePost(createPostViewModel);
                return Ok(new
                {
                    Result = "Tạo thành công."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdatePost(UpdatePostViewModel updatePostViewModel)
        {
            try
            {
                var result = await _postService.UpdatePost(updatePostViewModel);
                return Ok(new
                {
                    Reuslt = "Cập nhật thành công."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            try
            {
                var result = await _postService.DeletePost(id);
                return Ok(new
                {
                    Result = "Xoá thành công."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
