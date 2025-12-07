using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Brands
{
    public class BrandService : IBrandService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRepository<Brand> _brandRepository;

        public BrandService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _brandRepository = _unitOfWork.GetRepository<Brand>();
        }

        public async Task<ApiResponse<PagedResponse<BrandDto>>> GetAllAsync(PaginationParams pagination)
        {
            var query = _brandRepository.GetQueryable()
                .OrderBy(b => b.Name);

            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pagination.PageSize);

            var brands = await query
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .Select(b => new BrandDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Description = b.Description,
                    LogoUrl = b.LogoUrl,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            var pagedResponse = new PagedResponse<BrandDto>
            {
                Items = brands,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize,
                TotalPages = totalPages,
                TotalRecords = totalRecords
            };

            return ApiResponse<PagedResponse<BrandDto>>.SuccessResponse(pagedResponse);
        }

        public async Task<ApiResponse<BrandDto>> GetByIdAsync(int id)
        {
            var brand = await _brandRepository.GetByIdAsync(id);
            if (brand == null)
                return ApiResponse<BrandDto>.ErrorResponse("Brand not found");

            var dto = new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                Description = brand.Description,
                LogoUrl = brand.LogoUrl,
                CreatedAt = brand.CreatedAt
            };

            return ApiResponse<BrandDto>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<BrandDto>> CreateAsync(CreateBrandDto dto)
        {
            var existingBrand = await _brandRepository.GetQueryable()
                .FirstOrDefaultAsync(b => b.Name.ToLower() == dto.Name.ToLower());

            if (existingBrand != null)
                return ApiResponse<BrandDto>.ErrorResponse("Brand with this name already exists");

            var brand = new Brand
            {
                Name = dto.Name,
                Description = dto.Description,
                LogoUrl = dto.LogoUrl
            };

            await _brandRepository.AddAsync(brand);
            await _unitOfWork.SaveChangesAsync();

            return await GetByIdAsync(brand.Id);
        }

        public async Task<ApiResponse<BrandDto>> UpdateAsync(UpdateBrandDto dto)
        {
            var brand = await _brandRepository.GetByIdAsync(dto.Id);
            if (brand == null)
                return ApiResponse<BrandDto>.ErrorResponse("Brand not found");

            var existingBrand = await _brandRepository.GetQueryable()
                .FirstOrDefaultAsync(b => b.Name.ToLower() == dto.Name.ToLower() && b.Id != dto.Id);

            if (existingBrand != null)
                return ApiResponse<BrandDto>.ErrorResponse("Brand with this name already exists");

            brand.Name = dto.Name;
            brand.Description = dto.Description;
            brand.LogoUrl = dto.LogoUrl;

            await _brandRepository.UpdateAsync(brand);
            await _unitOfWork.SaveChangesAsync();

            return await GetByIdAsync(brand.Id);
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var brand = await _brandRepository.GetByIdAsync(id);
            if (brand == null)
                return ApiResponse<bool>.ErrorResponse("Brand not found");

            // Check if brand has watches
            var hasWatches = await _brandRepository.GetQueryable()
                .AnyAsync(b => b.Id == id && b.Watches.Any());

            if (hasWatches)
                return ApiResponse<bool>.ErrorResponse("Cannot delete brand with existing watches");

            await _brandRepository.DeleteAsync(brand);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Brand deleted successfully");
        }
    }
}
