using WatchStore.Application.DTOs;
using WatchStore.Application.Common;

namespace WatchStore.Application.Interfaces
{
    public interface IBrandService
    {
        Task<ApiResponse<PagedResponse<BrandDto>>> GetAllAsync(PaginationParams pagination);
        Task<ApiResponse<BrandDto>> GetByIdAsync(int id);
        Task<ApiResponse<BrandDto>> CreateAsync(CreateBrandDto dto);
        Task<ApiResponse<BrandDto>> UpdateAsync(UpdateBrandDto dto);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }
}
