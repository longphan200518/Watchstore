using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Inventory
{
    public class InventoryService : IInventoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRepository<Watch> _watchRepo;
        private readonly IRepository<InventoryTransaction> _txRepo;

        public InventoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _watchRepo = _unitOfWork.GetRepository<Watch>();
            _txRepo = _unitOfWork.GetRepository<InventoryTransaction>();
        }

        public async Task<ApiResponse<PagedResponse<InventoryItemDto>>> GetInventoryAsync(
            PaginationParams pagination, string? search = null)
        {
            var query = _watchRepo.GetQueryable()
                .Include(w => w.Brand)
                .Include(w => w.Category)
                .Include(w => w.Images)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(w => w.Name.Contains(search) || w.Brand.Name.Contains(search));

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)pagination.PageSize);

            var items = await query
                .OrderBy(w => w.Name)
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .Select(w => new InventoryItemDto
                {
                    WatchId = w.Id,
                    WatchName = w.Name,
                    BrandName = w.Brand.Name,
                    CategoryName = w.Category.Name,
                    Price = w.Price,
                    StockQuantity = w.StockQuantity,
                    Status = w.Status.ToString(),
                    ImageUrl = w.Images
                        .Where(img => !img.IsDeleted && img.IsPrimary)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault()
                        ?? w.Images.Where(img => !img.IsDeleted)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return ApiResponse<PagedResponse<InventoryItemDto>>.SuccessResponse(new PagedResponse<InventoryItemDto>
            {
                Items = items,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize,
                TotalPages = totalPages,
                TotalRecords = total
            });
        }

        public async Task<ApiResponse<PagedResponse<InventoryTransactionDto>>> GetTransactionsAsync(
            int? watchId, PaginationParams pagination)
        {
            var query = _txRepo.GetQueryable()
                .Include(t => t.Watch)
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            if (watchId.HasValue)
                query = query.Where(t => t.WatchId == watchId.Value);

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)pagination.PageSize);

            var items = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .Select(t => new InventoryTransactionDto
                {
                    Id = t.Id,
                    WatchId = t.WatchId,
                    WatchName = t.Watch.Name,
                    ChangeAmount = t.ChangeAmount,
                    TransactionType = t.TransactionType,
                    ReferenceType = t.ReferenceType,
                    ReferenceId = t.ReferenceId,
                    Note = t.Note,
                    CreatedByName = t.CreatedByUser != null ? t.CreatedByUser.FullName : "System",
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return ApiResponse<PagedResponse<InventoryTransactionDto>>.SuccessResponse(new PagedResponse<InventoryTransactionDto>
            {
                Items = items,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize,
                TotalPages = totalPages,
                TotalRecords = total
            });
        }

        public async Task<ApiResponse<bool>> AdjustStockAsync(AdjustStockDto dto, int adminUserId)
        {
            var watch = await _watchRepo.GetByIdAsync(dto.WatchId);
            if (watch == null)
                return ApiResponse<bool>.ErrorResponse("Không tìm thấy sản phẩm");

            var newStock = watch.StockQuantity + dto.ChangeAmount;
            if (newStock < 0)
                return ApiResponse<bool>.ErrorResponse($"Tồn kho không đủ. Hiện tại: {watch.StockQuantity}, giảm: {Math.Abs(dto.ChangeAmount)}");

            watch.StockQuantity = newStock;
            await _watchRepo.UpdateAsync(watch);

            var transaction = new InventoryTransaction
            {
                WatchId = dto.WatchId,
                ChangeAmount = dto.ChangeAmount,
                TransactionType = dto.TransactionType,
                ReferenceType = "Manual",
                Note = dto.Note,
                CreatedBy = adminUserId
            };

            await _txRepo.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true,
                $"Đã cập nhật tồn kho: {watch.StockQuantity - dto.ChangeAmount} → {newStock}");
        }
    }
}
