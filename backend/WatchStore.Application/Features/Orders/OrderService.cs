using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Enums;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Orders
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRepository<Order> _orderRepository;
        private readonly IRepository<OrderItem> _orderItemRepository;
        private readonly IRepository<Watch> _watchRepository;
        private readonly IEmailService _emailService;

        public OrderService(IUnitOfWork unitOfWork, IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _orderRepository = _unitOfWork.GetRepository<Order>();
            _orderItemRepository = _unitOfWork.GetRepository<OrderItem>();
            _watchRepository = _unitOfWork.GetRepository<Watch>();
            _emailService = emailService;
        }

        public async Task<ApiResponse<OrderDto>> CreateAsync(CreateOrderDto dto, int userId)
        {
            // Validate watches and calculate total
            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();

            foreach (var item in dto.OrderItems)
            {
                var watch = await _watchRepository.GetByIdAsync(item.WatchId);
                if (watch == null)
                    return ApiResponse<OrderDto>.ErrorResponse($"Watch with ID {item.WatchId} not found");

                if (watch.Status != WatchStatus.Available)
                    return ApiResponse<OrderDto>.ErrorResponse($"Watch '{watch.Name}' is not available");

                if (watch.StockQuantity < item.Quantity)
                    return ApiResponse<OrderDto>.ErrorResponse($"Insufficient stock for '{watch.Name}'. Available: {watch.StockQuantity}");

                var orderItem = new OrderItem
                {
                    WatchId = item.WatchId,
                    Quantity = item.Quantity,
                    Price = watch.Price
                };

                orderItems.Add(orderItem);
                totalAmount += watch.Price * item.Quantity;

                // Update stock
                watch.StockQuantity -= item.Quantity;
                if (watch.StockQuantity == 0)
                    watch.Status = WatchStatus.OutOfStock;
            }

            // Create order
            var order = new Order
            {
                UserId = userId,
                TotalAmount = totalAmount,
                Status = OrderStatus.Pending,
                ShippingAddress = dto.ShippingAddress,
                PhoneNumber = dto.PhoneNumber,
                Notes = dto.Notes,
                OrderItems = orderItems
            };

            await _orderRepository.AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            // Load order with full details including items, watches, images, and user
            var orderWithDetails = await _orderRepository.GetQueryable()
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Watch)
                    .ThenInclude(w => w.Images)
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            if (orderWithDetails == null)
                return await GetByIdAsync(order.Id);

            // Send confirmation email
            try
            {
                var orderItemsList = orderWithDetails.OrderItems.Select(item => (
                    ProductName: item.Watch.Name,
                    Quantity: item.Quantity,
                    Price: item.Price,
                    ImageUrl: item.Watch.Images.FirstOrDefault()?.ImageUrl ?? "https://via.placeholder.com/60"
                )).ToList();

                await _emailService.SendOrderConfirmationEmailAsync(
                    orderWithDetails.User.Email,
                    orderWithDetails.User.FullName,
                    orderWithDetails.Id,
                    orderWithDetails.TotalAmount,
                    orderItemsList,
                    orderWithDetails.ShippingAddress,
                    orderWithDetails.PhoneNumber ?? "Không có"
                );
                
                Console.WriteLine($"[ORDER] Email confirmation sent to {orderWithDetails.User.Email} for order #{orderWithDetails.Id}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ORDER] Failed to send email: {ex.Message}");
            }

            return await GetByIdAsync(order.Id);
        }

        public async Task<ApiResponse<PagedResponse<OrderDto>>> GetUserOrdersAsync(int userId, PaginationParams pagination)
        {
            var query = _orderRepository.GetQueryable()
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Watch)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt);

            return await GetOrdersPagedAsync(query, pagination);
        }

        public async Task<ApiResponse<PagedResponse<OrderDto>>> GetAllOrdersAsync(PaginationParams pagination)
        {
            var query = _orderRepository.GetQueryable()
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Watch)
                .OrderByDescending(o => o.CreatedAt);

            return await GetOrdersPagedAsync(query, pagination);
        }

        private async Task<ApiResponse<PagedResponse<OrderDto>>> GetOrdersPagedAsync(
            IQueryable<Order> query, 
            PaginationParams pagination)
        {
            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pagination.PageSize);

            var orders = await query
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    UserName = o.User.FullName,
                    UserEmail = o.User.Email!,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    ShippingAddress = o.ShippingAddress,
                    Notes = o.Notes,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        WatchId = oi.WatchId,
                        WatchName = oi.Watch.Name,
                        Quantity = oi.Quantity,
                        Price = oi.Price
                    }).ToList(),
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync();

            var pagedResponse = new PagedResponse<OrderDto>
            {
                Items = orders,
                PageNumber = pagination.PageNumber,
                PageSize = pagination.PageSize,
                TotalPages = totalPages,
                TotalRecords = totalRecords
            };

            return ApiResponse<PagedResponse<OrderDto>>.SuccessResponse(pagedResponse);
        }

        public async Task<ApiResponse<OrderDto>> GetByIdAsync(int id, int? userId = null)
        {
            var query = _orderRepository.GetQueryable()
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Watch)
                .Where(o => o.Id == id);

            if (userId.HasValue)
                query = query.Where(o => o.UserId == userId.Value);

            var order = await query.FirstOrDefaultAsync();

            if (order == null)
                return ApiResponse<OrderDto>.ErrorResponse("Order not found");

            var dto = new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                UserName = order.User.FullName,
                UserEmail = order.User.Email!,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                Notes = order.Notes,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    WatchId = oi.WatchId,
                    WatchName = oi.Watch.Name,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList(),
                CreatedAt = order.CreatedAt
            };

            return ApiResponse<OrderDto>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<bool>> UpdateStatusAsync(int orderId, OrderStatus status)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
                return ApiResponse<bool>.ErrorResponse("Order not found");

            order.Status = status;
            await _orderRepository.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, $"Order status updated to {status}");
        }

        public async Task<ApiResponse<bool>> CancelOrderAsync(int orderId, int userId)
        {
            var order = await _orderRepository.GetQueryable()
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Watch)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                return ApiResponse<bool>.ErrorResponse("Order not found");

            if (order.Status != OrderStatus.Pending)
                return ApiResponse<bool>.ErrorResponse("Only pending orders can be cancelled");

            // Restore stock
            foreach (var item in order.OrderItems)
            {
                item.Watch.StockQuantity += item.Quantity;
                if (item.Watch.Status == WatchStatus.OutOfStock)
                    item.Watch.Status = WatchStatus.Available;
            }

            order.Status = OrderStatus.Cancelled;
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Order cancelled successfully");
        }
    }
}
