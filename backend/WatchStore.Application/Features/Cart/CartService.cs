using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Common.Extensions;
using WatchStore.Domain.Enums;
using WatchStore.Domain.Interfaces;
using DomainCart = WatchStore.Domain.Entities.Cart;
using DomainCartItem = WatchStore.Domain.Entities.CartItem;
using WatchEntity = WatchStore.Domain.Entities.Watch;

namespace WatchStore.Application.Features.Cart
{
  public class CartService : ICartService
  {
    private const string SessionCartKey = "WATCHSTORE_CART";
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IRepository<WatchEntity> _watchRepository;
    private readonly IRepository<DomainCart> _cartRepository;
    private readonly IRepository<DomainCartItem> _cartItemRepository;

    public CartService(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
    {
      _unitOfWork = unitOfWork;
      _httpContextAccessor = httpContextAccessor;
      _watchRepository = unitOfWork.GetRepository<WatchEntity>();
      _cartRepository = unitOfWork.GetRepository<DomainCart>();
      _cartItemRepository = unitOfWork.GetRepository<DomainCartItem>();
    }

    public async Task<ApiResponse<CartDto>> GetCartAsync(int? userId = null)
    {
      var cart = await ResolveCartAsync(userId, createIfMissing: false);
      return ApiResponse<CartDto>.SuccessResponse(MapCart(cart));
    }

    public async Task<ApiResponse<CartDto>> AddItemAsync(AddCartItemDto dto, int? userId = null)
    {
      var watch = await _watchRepository.GetByIdAsync(dto.WatchId);
      if (watch == null)
        return ApiResponse<CartDto>.ErrorResponse("Sản phẩm không tồn tại");

      if (watch.Status != WatchStatus.Available)
        return ApiResponse<CartDto>.ErrorResponse("Sản phẩm hiện không khả dụng");

      if (dto.Quantity > watch.StockQuantity)
        return ApiResponse<CartDto>.ErrorResponse("Số lượng vượt quá tồn kho");

      if (userId.HasValue)
      {
        var cart = await ResolveCartAsync(userId, createIfMissing: true);
        var item = cart.CartItems.FirstOrDefault(x => x.WatchId == dto.WatchId);
        if (item == null)
        {
          cart.CartItems.Add(new DomainCartItem
          {
            WatchId = dto.WatchId,
            Quantity = dto.Quantity,
            UnitPrice = watch.Price
          });
        }
        else
        {
          item.Quantity += dto.Quantity;
          item.UnitPrice = watch.Price;
          await _cartItemRepository.UpdateAsync(item);
        }

        await _cartRepository.UpdateAsync(cart);
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<CartDto>.SuccessResponse(MapCart(cart), "Đã thêm vào giỏ hàng");
      }

      var sessionCart = GetSessionCart();
      var sessionItem = sessionCart.Items.FirstOrDefault(x => x.WatchId == dto.WatchId);
      if (sessionItem == null)
      {
        sessionCart.Items.Add(new CartItemDto
        {
          WatchId = dto.WatchId,
          WatchName = watch.Name,
          ImageUrl = watch.Images.FirstOrDefault()?.ImageUrl,
          Quantity = dto.Quantity,
          UnitPrice = watch.Price
        });
      }
      else
      {
        sessionItem.Quantity += dto.Quantity;
        sessionItem.UnitPrice = watch.Price;
      }

      SaveSessionCart(sessionCart);
      return ApiResponse<CartDto>.SuccessResponse(sessionCart, "Đã thêm vào giỏ hàng");
    }

    public async Task<ApiResponse<CartDto>> UpdateItemAsync(UpdateCartItemDto dto, int? userId = null)
    {
      var watch = await _watchRepository.GetByIdAsync(dto.WatchId);
      if (watch == null)
        return ApiResponse<CartDto>.ErrorResponse("Sản phẩm không tồn tại");

      if (dto.Quantity > watch.StockQuantity)
        return ApiResponse<CartDto>.ErrorResponse("Số lượng vượt quá tồn kho");

      if (userId.HasValue)
      {
        var cart = await ResolveCartAsync(userId, createIfMissing: false);
        var item = cart.CartItems.FirstOrDefault(x => x.WatchId == dto.WatchId);
        if (item == null)
          return ApiResponse<CartDto>.ErrorResponse("Sản phẩm không có trong giỏ");

        item.Quantity = dto.Quantity;
        item.UnitPrice = watch.Price;
        await _cartItemRepository.UpdateAsync(item);
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<CartDto>.SuccessResponse(MapCart(cart), "Cập nhật giỏ hàng thành công");
      }

      var sessionCart = GetSessionCart();
      var sessionItem = sessionCart.Items.FirstOrDefault(x => x.WatchId == dto.WatchId);
      if (sessionItem == null)
        return ApiResponse<CartDto>.ErrorResponse("Sản phẩm không có trong giỏ");

      sessionItem.Quantity = dto.Quantity;
      sessionItem.UnitPrice = watch.Price;
      SaveSessionCart(sessionCart);
      return ApiResponse<CartDto>.SuccessResponse(sessionCart, "Cập nhật giỏ hàng thành công");
    }

    public async Task<ApiResponse<bool>> RemoveItemAsync(int watchId, int? userId = null)
    {
      if (userId.HasValue)
      {
        var cart = await ResolveCartAsync(userId, createIfMissing: false);
        var item = cart.CartItems.FirstOrDefault(x => x.WatchId == watchId);
        if (item == null)
          return ApiResponse<bool>.ErrorResponse("Sản phẩm không có trong giỏ");

        await _cartItemRepository.DeleteAsync(item);
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<bool>.SuccessResponse(true, "Đã xóa sản phẩm khỏi giỏ hàng");
      }

      var sessionCart = GetSessionCart();
      sessionCart.Items.RemoveAll(x => x.WatchId == watchId);
      SaveSessionCart(sessionCart);
      return ApiResponse<bool>.SuccessResponse(true, "Đã xóa sản phẩm khỏi giỏ hàng");
    }

    public async Task<ApiResponse<CartDto>> ClearCartAsync(int? userId = null)
    {
      if (userId.HasValue)
      {
        var cart = await ResolveCartAsync(userId, createIfMissing: false);
        foreach (var item in cart.CartItems.ToList())
        {
          await _cartItemRepository.DeleteAsync(item);
        }
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<CartDto>.SuccessResponse(MapCart(cart), "Đã xóa giỏ hàng");
      }

      SaveSessionCart(new CartDto());
      return ApiResponse<CartDto>.SuccessResponse(new CartDto(), "Đã xóa giỏ hàng");
    }

    public async Task<ApiResponse<CartDto>> MergeSessionCartToUserAsync(int userId)
    {
      var sessionCart = GetSessionCart();
      if (!sessionCart.Items.Any())
      {
        var cart = await ResolveCartAsync(userId, createIfMissing: true);
        return ApiResponse<CartDto>.SuccessResponse(MapCart(cart));
      }

      var userCart = await ResolveCartAsync(userId, createIfMissing: true);
      foreach (var sessionItem in sessionCart.Items)
      {
        var watch = await _watchRepository.GetByIdAsync(sessionItem.WatchId);
        if (watch == null || watch.Status != WatchStatus.Available)
          continue;

        var existing = userCart.CartItems.FirstOrDefault(x => x.WatchId == sessionItem.WatchId);
        if (existing == null)
        {
          userCart.CartItems.Add(new DomainCartItem
          {
            WatchId = sessionItem.WatchId,
            Quantity = sessionItem.Quantity,
            UnitPrice = watch.Price
          });
        }
        else
        {
          existing.Quantity += sessionItem.Quantity;
          existing.UnitPrice = watch.Price;
          await _cartItemRepository.UpdateAsync(existing);
        }
      }

      SaveSessionCart(new CartDto());
      await _cartRepository.UpdateAsync(userCart);
      await _unitOfWork.SaveChangesAsync();
      return ApiResponse<CartDto>.SuccessResponse(MapCart(userCart), "Đã đồng bộ giỏ hàng");
    }

    private async Task<DomainCart> ResolveCartAsync(int? userId, bool createIfMissing)
    {
      if (!userId.HasValue)
        throw new InvalidOperationException("UserId is required for database cart operations");

      var cart = await _cartRepository.GetQueryable()
          .Include(c => c.CartItems)
          .ThenInclude(i => i.Watch)
          .FirstOrDefaultAsync(c => c.UserId == userId.Value && !c.IsDeleted);

      if (cart != null)
        return cart;

      if (!createIfMissing)
        return new DomainCart { UserId = userId.Value, CartItems = new List<DomainCartItem>() };

      cart = new DomainCart
      {
        UserId = userId.Value,
        SessionId = GetSessionId(),
        CartItems = new List<DomainCartItem>()
      };

      await _cartRepository.AddAsync(cart);
      await _unitOfWork.SaveChangesAsync();
      return cart;
    }

    private CartDto GetSessionCart()
    {
      var session = _httpContextAccessor.HttpContext?.Session;
      if (session == null)
        return new CartDto { SessionId = GetSessionId() };

      var cart = session.GetJson<CartDto>(SessionCartKey);
      if (cart == null)
      {
        cart = new CartDto { SessionId = GetSessionId() };
      }

      cart.SessionId ??= GetSessionId();
      return cart;
    }

    private void SaveSessionCart(CartDto cart)
    {
      cart.SessionId ??= GetSessionId();
      _httpContextAccessor.HttpContext?.Session.SetJson(SessionCartKey, cart);
    }

    private string GetSessionId()
    {
      var session = _httpContextAccessor.HttpContext?.Session;
      if (session == null)
        return string.Empty;

      if (!session.IsAvailable)
        session.LoadAsync().GetAwaiter().GetResult();

      return session.Id;
    }

    private static CartDto MapCart(DomainCart cart)
    {
      return new CartDto
      {
        Id = cart.Id,
        UserId = cart.UserId,
        SessionId = cart.SessionId,
        Items = cart.CartItems.Select(item => new CartItemDto
        {
          WatchId = item.WatchId,
          WatchName = item.Watch?.Name ?? string.Empty,
          ImageUrl = item.Watch?.Images.FirstOrDefault()?.ImageUrl,
          UnitPrice = item.UnitPrice,
          Quantity = item.Quantity
        }).ToList()
      };
    }

    private static CartDto MapCart(CartDto cart)
    {
      return cart;
    }
  }
}