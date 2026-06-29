using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Categories
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepository<Category> _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _categoryRepository = _unitOfWork.GetRepository<Category>();
        }

        public async Task<ApiResponse<List<CategoryDto>>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetQueryable()
                .Include(c => c.Watches)
                .OrderBy(c => c.Name)
                .ToListAsync();

            var dtos = categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                WatchCount = c.Watches.Count
            }).ToList();

            return ApiResponse<List<CategoryDto>>.SuccessResponse(dtos);
        }

        public async Task<ApiResponse<CategoryDto>> GetByIdAsync(int id)
        {
            var category = await _categoryRepository.GetQueryable()
                .Include(c => c.Watches)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return ApiResponse<CategoryDto>.ErrorResponse("Category not found");

            return ApiResponse<CategoryDto>.SuccessResponse(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                WatchCount = category.Watches.Count
            });
        }

        public async Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };

            await _categoryRepository.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<CategoryDto>.SuccessResponse(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                WatchCount = 0
            }, "Category created successfully");
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                return ApiResponse<bool>.ErrorResponse("Category not found");

            await _categoryRepository.DeleteAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Category deleted successfully");
        }

        public async Task<ApiResponse<CategoryDto>> UpdateAsync(UpdateCategoryDto dto)
        {
            var category = await _categoryRepository.GetQueryable()
                .Include(c => c.Watches)
                .FirstOrDefaultAsync(c => c.Id == dto.Id);

            if (category == null)
                return ApiResponse<CategoryDto>.ErrorResponse("Category not found");

            category.Name = dto.Name;
            category.Description = dto.Description;

            await _categoryRepository.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<CategoryDto>.SuccessResponse(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                WatchCount = category.Watches.Count
            }, "Category updated successfully");
        }
    }
}
