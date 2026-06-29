using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
    [ApiController]
    [Route("api/categories")]
    [ApiExplorerSettings(GroupName = "user")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// <summary>Lấy tất cả danh mục</summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllAsync();
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>Lấy danh mục theo ID</summary>
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _categoryService.GetByIdAsync(id);
            return result.Success ? Ok(result) : NotFound(result);
        }

        /// <summary>Tạo danh mục mới (Admin only)</summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ApiExplorerSettings(GroupName = "admin")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _categoryService.CreateAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>Xóa danh mục (Admin only)</summary>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        [ApiExplorerSettings(GroupName = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _categoryService.DeleteAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        /// <summary>Cập nhật danh mục (Admin only)</summary>
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        [ApiExplorerSettings(GroupName = "admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            dto.Id = id;
            var result = await _categoryService.UpdateAsync(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
