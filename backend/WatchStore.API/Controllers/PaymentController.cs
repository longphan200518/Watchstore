using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatchStore.Application.Services;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Interfaces;
using WatchStore.Domain.Enums;

namespace WatchStore.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [ApiExplorerSettings(GroupName = "user")]
  public class PaymentController : ControllerBase
  {
    private readonly VNPayService _vnPayService;
    private readonly IRepository<WatchStore.Domain.Entities.Order> _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;

    public PaymentController(
        VNPayService vnPayService,
        IRepository<WatchStore.Domain.Entities.Order> orderRepository,
        IUnitOfWork unitOfWork,
        IEmailService emailService)
    {
      _vnPayService = vnPayService;
      _orderRepository = orderRepository;
      _unitOfWork = unitOfWork;
      _emailService = emailService;
    }

    [HttpPost("create-vnpay-url")]
    [Authorize]
    public async Task<IActionResult> CreateVNPayUrl([FromBody] CreatePaymentRequest request)
    {
      try
      {
        var order = await _orderRepository.GetByIdAsync(request.OrderId);
        if (order == null)
        {
          return NotFound(new { success = false, message = "Đơn hàng không tồn tại" });
        }

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var orderInfo = $"Thanh toán đơn hàng #{order.Id}";
        var paymentUrl = _vnPayService.CreatePaymentUrl(order.Id, order.TotalAmount, orderInfo, ipAddress);

        return Ok(new { success = true, data = new { paymentUrl } });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { success = false, message = ex.Message });
      }
    }

    [HttpGet("vnpay-return")]
    [AllowAnonymous]
    public async Task<IActionResult> VNPayReturn()
    {
      try
      {
        var vnpayData = new Dictionary<string, string>();
        foreach (var key in Request.Query.Keys)
        {
          vnpayData[key] = Request.Query[key].ToString();
        }

        var vnpSecureHash = Request.Query["vnp_SecureHash"].ToString();
        var isValidSignature = _vnPayService.ValidateSignature(vnpayData, vnpSecureHash);

        if (!isValidSignature)
        {
          return BadRequest(new { success = false, message = "Chữ ký không hợp lệ" });
        }

        var orderId = int.Parse(Request.Query["vnp_TxnRef"].ToString());
        var responseCode = Request.Query["vnp_ResponseCode"].ToString();

        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
          return NotFound(new { success = false, message = "Đơn hàng không tồn tại" });
        }

        if (responseCode == "00")
        {
          // Payment success
          order.Status = OrderStatus.Processing;
          await _orderRepository.UpdateAsync(order);
          await _unitOfWork.SaveChangesAsync();

          // Load order with items and watch details for email
          var dbContext = _unitOfWork as WatchStore.Infrastructure.Data.WatchStoreDbContext;
          if (dbContext != null)
          {
            await dbContext.Entry(order)
              .Collection(o => o.OrderItems)
              .Query()
              .Include(oi => oi.Watch)
              .ThenInclude(w => w.Images)
              .LoadAsync();
            await dbContext.Entry(order).Reference(o => o.User).LoadAsync();
          }

          // Send email notification
          try
          {
            var orderItemsList = order.OrderItems.Select(item => (
              ProductName: item.Watch.Name,
              Quantity: item.Quantity,
              Price: item.Price,
              ImageUrl: item.Watch.Images.FirstOrDefault()?.ImageUrl ?? "https://via.placeholder.com/60"
            )).ToList();

            await _emailService.SendOrderConfirmationEmailAsync(
                order.User.Email,
                order.User.FullName,
                order.Id,
                order.TotalAmount,
                orderItemsList,
                order.ShippingAddress,
                order.PhoneNumber ?? "Không có"
            );
          }
          catch (Exception emailEx)
          {
            // Log email error but don't fail the request
            Console.WriteLine($"Failed to send email: {emailEx.Message}");
          }

          return Redirect($"http://localhost:6868/payment-success?orderId={orderId}");
        }
        else
        {
          // Payment failed
          return Redirect($"http://localhost:6868/payment-failed?orderId={orderId}");
        }
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { success = false, message = ex.Message });
      }
    }
  }

  public class CreatePaymentRequest
  {
    public int OrderId { get; set; }
  }
}
