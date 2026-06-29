using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Wishlists
{
    public class WishlistService : IWishlistService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRepository<Wishlist> _wishlistRepo;

        public WishlistService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _wishlistRepo = _unitOfWork.GetRepository<Wishlist>();
        }

        public async Task<ApiResponse<List<WishlistItemDto>>> GetWishlistAsync(int userId)
        {
            var items = await _wishlistRepo.GetQueryable()
                .Where(w => w.UserId == userId)
                .Include(w => w.Watch)
                    .ThenInclude(watch => watch.Brand)
                .Include(w => w.Watch)
                    .ThenInclude(watch => watch.Images)
                .OrderByDescending(w => w.CreatedAt)
                .Select(w => new WishlistItemDto
                {
                    WatchId = w.WatchId,
                    WatchName = w.Watch.Name,
                    Price = w.Watch.Price,
                    BrandName = w.Watch.Brand.Name,
                    ImageUrl = w.Watch.Images
                        .Where(img => !img.IsDeleted && img.IsPrimary)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault()
                        ?? w.Watch.Images
                        .Where(img => !img.IsDeleted)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault(),
                    AddedAt = w.CreatedAt
                })
                .ToListAsync();

            return ApiResponse<List<WishlistItemDto>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<bool>> AddToWishlistAsync(int userId, int watchId)
        {
            var exists = await _wishlistRepo.GetQueryable()
                .AnyAsync(w => w.UserId == userId && w.WatchId == watchId);

            if (exists)
                return ApiResponse<bool>.SuccessResponse(true, "Sản phẩm đã có trong danh sách yêu thích");

            var wishlistItem = new Wishlist
            {
                UserId = userId,
                WatchId = watchId
            };

            await _wishlistRepo.AddAsync(wishlistItem);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Đã thêm vào danh sách yêu thích");
        }

        public async Task<ApiResponse<bool>> RemoveFromWishlistAsync(int userId, int watchId)
        {
            var item = await _wishlistRepo.GetQueryable()
                .FirstOrDefaultAsync(w => w.UserId == userId && w.WatchId == watchId);

            if (item == null)
                return ApiResponse<bool>.ErrorResponse("Không tìm thấy sản phẩm trong danh sách yêu thích");

            await _wishlistRepo.DeleteAsync(item);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Đã xóa khỏi danh sách yêu thích");
        }

        public async Task<ApiResponse<bool>> IsInWishlistAsync(int userId, int watchId)
        {
            var exists = await _wishlistRepo.GetQueryable()
                .AnyAsync(w => w.UserId == userId && w.WatchId == watchId);

            return ApiResponse<bool>.SuccessResponse(exists);
        }

        public async Task<ApiResponse<bool>> ClearWishlistAsync(int userId)
        {
            var items = await _wishlistRepo.GetQueryable()
                .Where(w => w.UserId == userId)
                .ToListAsync();

            foreach (var item in items)
                await _wishlistRepo.DeleteAsync(item);

            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Đã xóa toàn bộ danh sách yêu thích");
        }
    }
}
