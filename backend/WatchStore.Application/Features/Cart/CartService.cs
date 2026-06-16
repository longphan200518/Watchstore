using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Enums;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Cart
{
    public class CartService : ICartService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRepository<Domain.Entities.Cart> _cartRepository;
        private readonly IRepository<CartItem> _cartItemRepository;
        private readonly IRepository<Watch> _watchRepository;

        public CartService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _cartRepository = _unitOfWork.GetRepository<Domain.Entities.Cart>();
            _cartItemRepository = _unitOfWork.GetRepository<CartItem>();
            _watchRepository = _unitOfWork.GetRepository<Watch>();
        }

        // ─────────────────────────────────────────────────────────────────
        // GET CART
        // ─────────────────────────────────────────────────────────────────
        public async Task<ApiResponse<CartDto>> GetCartAsync(int? userId, string? sessionId)
        {
            var cart = await FindCartAsync(userId, sessionId);
            if (cart == null)
                return ApiResponse<CartDto>.SuccessResponse(new CartDto { SessionId = sessionId });

            return ApiResponse<CartDto>.SuccessResponse(MapToDto(cart));
        }

        // ─────────────────────────────────────────────────────────────────
        // ADD TO CART
        // Nếu sản phẩm đã có trong giỏ → tăng số lượng
        // Nếu chưa có → tạo dòng mới
        // ─────────────────────────────────────────────────────────────────
        public async Task<ApiResponse<CartDto>> AddToCartAsync(int? userId, string? sessionId, AddToCartDto dto)
        {
            // Validate watch tồn tại và còn hàng (AsNoTracking để tránh conflict khi update CartItem)
            var watch = await _watchRepository.GetQueryable()
                .FirstOrDefaultAsync(w => w.Id == dto.WatchId);
            if (watch == null)
                return ApiResponse<CartDto>.ErrorResponse("Sản phẩm không tồn tại");

            if (watch.Status != WatchStatus.Available)
                return ApiResponse<CartDto>.ErrorResponse($"Sản phẩm '{watch.Name}' hiện không khả dụng");

            if (watch.StockQuantity < dto.Quantity)
                return ApiResponse<CartDto>.ErrorResponse($"Sản phẩm '{watch.Name}' chỉ còn {watch.StockQuantity} sản phẩm");

            // Lấy hoặc tạo giỏ hàng (không include Watch để tránh EF tracking conflict)
            var cart = await FindCartAsync(userId, sessionId, includeDetails: false);
            if (cart == null)
            {
                cart = new Domain.Entities.Cart
                {
                    UserId = userId,
                    SessionId = userId.HasValue ? null : sessionId
                };
                await _cartRepository.AddAsync(cart);
                await _unitOfWork.SaveChangesAsync();

                cart = await FindCartAsync(userId, sessionId, includeDetails: false);
                cart!.CartItems = new List<CartItem>();
            }

            // Kiểm tra sản phẩm đã có trong giỏ chưa (bao gồm cả các item đã bị soft-delete)
            var existingItem = await _cartItemRepository.GetQueryable()
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(i => i.CartId == cart.Id && i.WatchId == dto.WatchId);

            if (existingItem != null)
            {
                if (existingItem.IsDeleted)
                {
                    // Undelete và reset số lượng
                    existingItem.IsDeleted = false;
                    existingItem.Quantity = dto.Quantity;
                    existingItem.UnitPrice = watch.Price;
                    await _cartItemRepository.UpdateAsync(existingItem);
                }
                else
                {
                    // Sản phẩm đang có sẵn → tăng số lượng
                    int newQty = existingItem.Quantity + dto.Quantity;
                    if (newQty > watch.StockQuantity)
                        return ApiResponse<CartDto>.ErrorResponse($"Sản phẩm '{watch.Name}' chỉ còn {watch.StockQuantity} sản phẩm (giỏ hàng hiện có {existingItem.Quantity})");

                    existingItem.Quantity = newQty;
                    existingItem.UnitPrice = watch.Price; // Cập nhật giá mới nhất
                    await _cartItemRepository.UpdateAsync(existingItem);
                }
            }
            else
            {
                // ✅ Sản phẩm hoàn toàn chưa có → tạo dòng mới
                var cartItem = new CartItem
                {
                    CartId = cart.Id,
                    WatchId = dto.WatchId,
                    Quantity = dto.Quantity,
                    UnitPrice = watch.Price
                };
                await _cartItemRepository.AddAsync(cartItem);
            }

            await _unitOfWork.SaveChangesAsync();

            // Load lại giỏ hàng để trả về
            cart = await FindCartAsync(userId, sessionId);
            return ApiResponse<CartDto>.SuccessResponse(MapToDto(cart!), "Đã thêm vào giỏ hàng");
        }

        // ─────────────────────────────────────────────────────────────────
        // UPDATE QUANTITY
        // ─────────────────────────────────────────────────────────────────
        public async Task<ApiResponse<CartDto>> UpdateQuantityAsync(int? userId, string? sessionId, int cartItemId, UpdateCartItemDto dto)
        {
            var cart = await FindCartAsync(userId, sessionId, includeDetails: false);
            if (cart == null)
                return ApiResponse<CartDto>.ErrorResponse("Giỏ hàng không tồn tại");

            var item = cart.CartItems.FirstOrDefault(i => i.Id == cartItemId);
            if (item == null)
                return ApiResponse<CartDto>.ErrorResponse("Sản phẩm không có trong giỏ hàng");

            // Validate tồn kho
            var watch = await _watchRepository.GetQueryable()
                .FirstOrDefaultAsync(w => w.Id == item.WatchId);
            if (watch != null && dto.Quantity > watch.StockQuantity)
                return ApiResponse<CartDto>.ErrorResponse($"Sản phẩm chỉ còn {watch.StockQuantity} trong kho");

            item.Quantity = dto.Quantity;
            if (watch != null) item.UnitPrice = watch.Price; // Cập nhật giá
            await _cartItemRepository.UpdateAsync(item);
            await _unitOfWork.SaveChangesAsync();

            cart = await FindCartAsync(userId, sessionId);
            return ApiResponse<CartDto>.SuccessResponse(MapToDto(cart!));
        }

        // ─────────────────────────────────────────────────────────────────
        // REMOVE ITEM
        // ─────────────────────────────────────────────────────────────────
        public async Task<ApiResponse<bool>> RemoveItemAsync(int? userId, string? sessionId, int cartItemId)
        {
            var cart = await FindCartAsync(userId, sessionId, includeDetails: false);
            if (cart == null)
                return ApiResponse<bool>.ErrorResponse("Giỏ hàng không tồn tại");

            var item = cart.CartItems.FirstOrDefault(i => i.Id == cartItemId);
            if (item == null)
                return ApiResponse<bool>.ErrorResponse("Sản phẩm không có trong giỏ hàng");

            item.IsDeleted = true;
            await _cartItemRepository.UpdateAsync(item);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Đã xóa sản phẩm khỏi giỏ hàng");
        }

        // ─────────────────────────────────────────────────────────────────
        // CLEAR CART
        // ─────────────────────────────────────────────────────────────────
        public async Task<ApiResponse<bool>> ClearCartAsync(int? userId, string? sessionId)
        {
            var cart = await FindCartAsync(userId, sessionId, includeDetails: false);
            if (cart == null)
                return ApiResponse<bool>.SuccessResponse(true, "Giỏ hàng đã trống");

            foreach (var item in cart.CartItems)
            {
                item.IsDeleted = true;
                await _cartItemRepository.UpdateAsync(item);
            }

            await _unitOfWork.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Đã xóa giỏ hàng");
        }

        // ─────────────────────────────────────────────────────────────────
        // MERGE CART (Session → User khi đăng nhập)
        // ─────────────────────────────────────────────────────────────────
        public async Task<ApiResponse<CartDto>> MergeCartAsync(string sessionId, int userId)
        {
            // Tìm giỏ hàng của session (khách vãng lai)
            var sessionCart = await FindCartAsync(null, sessionId, includeDetails: false);

            // Tìm hoặc tạo giỏ hàng của user đã đăng nhập
            var userCart = await FindCartAsync(userId, null, includeDetails: false);
            if (userCart == null)
            {
                // Nếu user chưa có giỏ → chuyển quyền sở hữu giỏ session cho user
                if (sessionCart != null)
                {
                    sessionCart.UserId = userId;
                    sessionCart.SessionId = null;
                    await _cartRepository.UpdateAsync(sessionCart);
                    await _unitOfWork.SaveChangesAsync();
                    sessionCart = await FindCartAsync(userId, null);
                    return ApiResponse<CartDto>.SuccessResponse(MapToDto(sessionCart!), "Đã chuyển giỏ hàng vào tài khoản");
                }

                // Cả hai đều không có giỏ → trả về rỗng
                return ApiResponse<CartDto>.SuccessResponse(new CartDto { UserId = userId }, "Giỏ hàng trống");
            }

            // User đã có giỏ → merge từng item của session vào giỏ user
            if (sessionCart != null && sessionCart.CartItems.Any())
            {
                foreach (var sessionItem in sessionCart.CartItems)
                {
                    // Kiểm tra item bao gồm cả item đã xóa
                    var existingItem = await _cartItemRepository.GetQueryable()
                        .IgnoreQueryFilters()
                        .FirstOrDefaultAsync(i => i.CartId == userCart.Id && i.WatchId == sessionItem.WatchId);

                    if (existingItem != null)
                    {
                        if (existingItem.IsDeleted)
                        {
                            // Undelete
                            existingItem.IsDeleted = false;
                            existingItem.Quantity = sessionItem.Quantity;
                            existingItem.UnitPrice = sessionItem.UnitPrice;
                            await _cartItemRepository.UpdateAsync(existingItem);
                        }
                        else
                        {
                            // Cùng sản phẩm → cộng dồn số lượng
                            existingItem.Quantity += sessionItem.Quantity;
                            await _cartItemRepository.UpdateAsync(existingItem);
                        }
                    }
                    else
                    {
                        // Sản phẩm mới → chuyển sang giỏ user
                        var newItem = new CartItem
                        {
                            CartId = userCart.Id,
                            WatchId = sessionItem.WatchId,
                            Quantity = sessionItem.Quantity,
                            UnitPrice = sessionItem.UnitPrice
                        };
                        await _cartItemRepository.AddAsync(newItem);
                    }

                    // Đánh dấu xóa item session cũ
                    sessionItem.IsDeleted = true;
                    await _cartItemRepository.UpdateAsync(sessionItem);
                }

                // Đánh dấu xóa giỏ session cũ
                sessionCart.IsDeleted = true;
                await _cartRepository.UpdateAsync(sessionCart);
                await _unitOfWork.SaveChangesAsync();
            }

            userCart = await FindCartAsync(userId, null);
            return ApiResponse<CartDto>.SuccessResponse(MapToDto(userCart!), "Đã merge giỏ hàng thành công");
        }

        // ─────────────────────────────────────────────────────────────────
        // HELPER: Tìm giỏ hàng theo userId hoặc sessionId
        // ─────────────────────────────────────────────────────────────────
        private async Task<Domain.Entities.Cart?> FindCartAsync(int? userId, string? sessionId, bool includeDetails = true)
        {
            IQueryable<Domain.Entities.Cart> query = _cartRepository.GetQueryable()
                .Include(c => c.CartItems);

            if (includeDetails)
            {
                query = query
                    .Include(c => c.CartItems)
                        .ThenInclude(ci => ci.Watch)
                            .ThenInclude(w => w.Images)
                    .Include(c => c.CartItems)
                        .ThenInclude(ci => ci.Watch)
                            .ThenInclude(w => w.Brand);
            }

            if (userId.HasValue)
                return await query.FirstOrDefaultAsync(c => c.UserId == userId.Value);

            if (!string.IsNullOrEmpty(sessionId))
                return await query.FirstOrDefaultAsync(c => c.SessionId == sessionId);

            return null;
        }

        // ─────────────────────────────────────────────────────────────────
        // HELPER: Map Cart entity → CartDto
        // ─────────────────────────────────────────────────────────────────
        private static CartDto MapToDto(Domain.Entities.Cart cart)
        {
            return new CartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                SessionId = cart.SessionId,
                Items = cart.CartItems.Select(i => new CartItemDto
                {
                    Id = i.Id,
                    WatchId = i.WatchId,
                    WatchName = i.Watch?.Name ?? string.Empty,
                    WatchImageUrl = i.Watch?.Images?.FirstOrDefault(img => img.IsPrimary)?.ImageUrl
                                 ?? i.Watch?.Images?.FirstOrDefault()?.ImageUrl,
                    BrandName = i.Watch?.Brand?.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    StockQuantity = i.Watch?.StockQuantity ?? 0
                }).ToList()
            };
        }
    }
}
