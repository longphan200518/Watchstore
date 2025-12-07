using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Application.Specifications;
using WatchStore.Common.Constants;
using WatchStore.Common.Extensions;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Enums;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Watches
{
    public class WatchService : BaseService, IWatchService
    {
        private readonly IRepository<Watch> _watchRepository;
        private readonly IRepository<Brand> _brandRepository;

        public WatchService(
            IUnitOfWork unitOfWork,
            IMemoryCache cache,
            ILogger<WatchService> logger) : base(unitOfWork, cache, logger)
        {
            _watchRepository = unitOfWork.GetRepository<Watch>();
            _brandRepository = unitOfWork.GetRepository<Brand>();
        }

        public async Task<ApiResponse<PagedResponse<WatchDto>>> GetAllAsync(WatchFilterDto filter, PaginationParams pagination)
        {
            try
            {
                Logger.LogInformation("Getting watches with filters: {@Filter}", filter);

                var query = _watchRepository.GetQueryable()
                    .Include(w => w.Brand)
                    .Include(w => w.Images)
                    .WhereIf(!filter.SearchTerm.IsNullOrEmpty(), w =>
                        w.Name.ToLower().Contains(filter.SearchTerm!.ToLower()) ||
                        (w.Description != null && w.Description.ToLower().Contains(filter.SearchTerm!.ToLower())))
                    .WhereIf(filter.BrandId.HasValue, w => w.BrandId == filter.BrandId!.Value)
                    .WhereIf(filter.MinPrice.HasValue, w => w.Price >= filter.MinPrice!.Value)
                    .WhereIf(filter.MaxPrice.HasValue, w => w.Price <= filter.MaxPrice!.Value)
                    .WhereIf(filter.Status.HasValue, w => w.Status == filter.Status!.Value);

                // Apply sorting
                query = filter.SortBy?.ToLower() switch
                {
                    "name" => filter.IsDescending ? query.OrderByDescending(w => w.Name) : query.OrderBy(w => w.Name),
                    "price" => filter.IsDescending ? query.OrderByDescending(w => w.Price) : query.OrderBy(w => w.Price),
                    _ => filter.IsDescending ? query.OrderByDescending(w => w.CreatedAt) : query.OrderBy(w => w.CreatedAt)
                };

                var totalRecords = await query.CountAsync();
                var totalPages = (int)Math.Ceiling(totalRecords / (double)pagination.PageSize);

                var watchEntities = await query
                    .Paginate(pagination.PageNumber, pagination.PageSize)
                    .ToListAsync();

                var watches = watchEntities.Select(w => MapToDto(w)).ToList();

                Logger.LogInformation("Found {Count} watches", totalRecords);

                var pagedResponse = new PagedResponse<WatchDto>
                {
                    Items = watches,
                    PageNumber = pagination.PageNumber,
                    PageSize = pagination.PageSize,
                    TotalPages = totalPages,
                    TotalRecords = totalRecords
                };

                return ApiResponse<PagedResponse<WatchDto>>.SuccessResponse(pagedResponse);
            }
            catch (Exception ex)
            {
                return LogAndReturnError<PagedResponse<WatchDto>>("Error getting watches", ex);
            }
        }

        public async Task<ApiResponse<WatchDto>> GetByIdAsync(int id)
        {
            try
            {
                var cacheKey = AppConstants.CacheKeys.GetWatchKey(id);

                var dto = await ExecuteWithCache(cacheKey, async () =>
                {
                    var watch = await _watchRepository.GetQueryable()
                        .Include(w => w.Brand)
                        .Include(w => w.Seller)
                        .Include(w => w.Images)
                        .FirstOrDefaultAsync(w => w.Id == id);

                    return watch != null ? MapToDto(watch) : null;
                }, AppConstants.CacheDuration.MediumMinutes);

                if (dto == null)
                    return ApiResponse<WatchDto>.ErrorResponse("Watch not found");

                return ApiResponse<WatchDto>.SuccessResponse(dto);
            }
            catch (Exception ex)
            {
                return LogAndReturnError<WatchDto>($"Error getting watch with ID {id}", ex);
            }
        }

        public async Task<ApiResponse<WatchDto>> CreateAsync(CreateWatchDto dto, int? sellerId = null)
        {
            return await ExecuteInTransaction(async () =>
            {
                try
                {
                    Logger.LogInformation("Creating watch: {Name}", dto.Name);

                    var brand = await _brandRepository.GetByIdAsync(dto.BrandId);
                    if (brand == null)
                        return ApiResponse<WatchDto>.ErrorResponse("Brand not found");

                    var watch = new Watch
                    {
                        Name = dto.Name,
                        Description = dto.Description,
                        Price = dto.Price,
                        StockQuantity = dto.StockQuantity,
                        Status = dto.Status,
                        BrandId = dto.BrandId,
                        CaseSize = dto.CaseSize,
                        Movement = dto.Movement,
                        WaterResistance = dto.WaterResistance,
                        SellerId = sellerId
                    };

                    await _watchRepository.AddAsync(watch);
                    await UnitOfWork.SaveChangesAsync();

                    Logger.LogInformation("Watch created with ID: {WatchId}", watch.Id);

                    // Invalidate related caches
                    InvalidateCache(AppConstants.CacheKeys.PopularWatches);

                    return await GetByIdAsync(watch.Id);
                }
                catch (Exception ex)
                {
                    return LogAndReturnError<WatchDto>("Error creating watch", ex);
                }
            }, "CreateWatch");
        }

        public async Task<ApiResponse<WatchDto>> UpdateAsync(UpdateWatchDto dto)
        {
            return await ExecuteInTransaction(async () =>
            {
                try
                {
                    Logger.LogInformation("Updating watch ID: {WatchId}", dto.Id);

                    var watch = await _watchRepository.GetByIdAsync(dto.Id);
                    if (watch == null)
                        return ApiResponse<WatchDto>.ErrorResponse("Watch not found");

                    var brand = await _brandRepository.GetByIdAsync(dto.BrandId);
                    if (brand == null)
                        return ApiResponse<WatchDto>.ErrorResponse("Brand not found");

                    watch.Name = dto.Name;
                    watch.Description = dto.Description;
                    watch.Price = dto.Price;
                    watch.StockQuantity = dto.StockQuantity;
                    watch.Status = dto.Status;
                    watch.BrandId = dto.BrandId;
                    watch.CaseSize = dto.CaseSize;
                    watch.Movement = dto.Movement;
                    watch.WaterResistance = dto.WaterResistance;

                    await _watchRepository.UpdateAsync(watch);
                    await UnitOfWork.SaveChangesAsync();

                    // Invalidate cache for this watch
                    InvalidateCache(AppConstants.CacheKeys.GetWatchKey(dto.Id));
                    InvalidateCache(AppConstants.CacheKeys.PopularWatches);

                    Logger.LogInformation("Watch updated successfully: {WatchId}", dto.Id);

                    return await GetByIdAsync(watch.Id);
                }
                catch (Exception ex)
                {
                    return LogAndReturnError<WatchDto>($"Error updating watch {dto.Id}", ex);
                }
            }, "UpdateWatch");
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            return await ExecuteInTransaction(async () =>
            {
                try
                {
                    Logger.LogInformation("Deleting watch ID: {WatchId}", id);

                    var watch = await _watchRepository.GetByIdAsync(id);
                    if (watch == null)
                        return ApiResponse<bool>.ErrorResponse("Watch not found");

                    await _watchRepository.DeleteAsync(watch);
                    await UnitOfWork.SaveChangesAsync();

                    // Invalidate cache
                    InvalidateCache(AppConstants.CacheKeys.GetWatchKey(id));
                    InvalidateCache(AppConstants.CacheKeys.PopularWatches);

                    Logger.LogInformation("Watch deleted successfully: {WatchId}", id);

                    return ApiResponse<bool>.SuccessResponse(true, "Watch deleted successfully");
                }
                catch (Exception ex)
                {
                    return LogAndReturnError<bool>($"Error deleting watch {id}", ex);
                }
            }, "DeleteWatch");
        }

        // Helper method to map Watch entity to DTO
        private static WatchDto MapToDto(Watch watch)
        {
            return new WatchDto
            {
                Id = watch.Id,
                Name = watch.Name,
                Description = watch.Description,
                Price = watch.Price,
                StockQuantity = watch.StockQuantity,
                Status = watch.Status,
                BrandId = watch.BrandId,
                BrandName = watch.Brand?.Name ?? string.Empty,
                SellerId = watch.SellerId,
                SellerName = watch.Seller?.FullName,
                CaseSize = watch.CaseSize,
                Movement = watch.Movement,
                WaterResistance = watch.WaterResistance,
                Images = watch.Images.Select(i => new WatchImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    IsPrimary = i.IsPrimary
                }).ToList(),
                CreatedAt = watch.CreatedAt
            };
        }
    }
}
