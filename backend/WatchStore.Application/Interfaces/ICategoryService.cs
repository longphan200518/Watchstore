using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<ApiResponse<List<CategoryDto>>> GetAllAsync();
        Task<ApiResponse<CategoryDto>> GetByIdAsync(int id);
        Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto dto);
        Task<ApiResponse<CategoryDto>> UpdateAsync(UpdateCategoryDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }
}
