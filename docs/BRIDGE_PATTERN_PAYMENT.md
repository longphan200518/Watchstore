# Bridge Pattern Implementation - Payment System

## 📖 Tổng quan

Hệ thống Payment đã được refactor để áp dụng **Bridge Pattern**, cho phép tách biệt **abstraction** (cách thức thanh toán) khỏi **implementation** (nhà cung cấp thanh toán).

## 🏗️ Architecture

### Bridge Pattern Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Bridge Pattern                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Abstraction                    Implementor                │
│  ├── PaymentProcessor           ├── IPaymentProvider       │
│  │   (abstract class)           │   (interface)            │
│  │                               │                          │
│  ├── Refined Abstractions        ├── Concrete Implementors │
│  │   ├── OnlinePaymentProcessor │   ├── VNPayProvider      │
│  │   └── CODPaymentProcessor    │   ├── CODProvider        │
│  │                               │   ├── MomoProvider (TBD) │
│  │                               │   └── ZaloPayProvider    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
WatchStore.Application/
└── Services/
    └── Payment/
        ├── IPaymentProvider.cs           # Implementor interface
        ├── PaymentModels.cs              # DTOs & Enums
        ├── VNPayProvider.cs              # Concrete Implementor
        ├── CODProvider.cs                # Concrete Implementor
        ├── PaymentProcessor.cs           # Abstraction
        ├── OnlinePaymentProcessor.cs     # Refined Abstraction
        └── PaymentService.cs             # Facade/Client
```

## 🔑 Key Components

### 1. Implementor (IPaymentProvider)

Interface định nghĩa contract cho các payment provider:

```csharp
public interface IPaymentProvider
{
    string ProviderName { get; }
    Task<PaymentUrlResult> CreatePaymentUrlAsync(PaymentRequest request);
    Task<PaymentValidationResult> ValidatePaymentResponseAsync(Dictionary<string, string> responseData);
    Task<bool> IsAvailableAsync();
}
```

### 2. Concrete Implementors

- **VNPayProvider**: Implementation cho VNPay payment gateway
- **CODProvider**: Implementation cho Cash on Delivery
- **MomoProvider** (Future): Implementation cho Momo e-wallet
- **ZaloPayProvider** (Future): Implementation cho ZaloPay

### 3. Abstraction (PaymentProcessor)

Abstract class định nghĩa high-level payment operations:

```csharp
public abstract class PaymentProcessor
{
    protected readonly IPaymentProvider _provider;
    
    public async Task<PaymentUrlResult> ProcessPaymentAsync(PaymentRequest request)
    {
        // Template method pattern
        await BeforeProcessPaymentAsync(request);
        var result = await _provider.CreatePaymentUrlAsync(request); // Bridge!
        await AfterProcessPaymentAsync(request, result);
        return result;
    }
    
    public abstract PaymentMethod GetPaymentMethod();
}
```

### 4. Refined Abstractions

- **OnlinePaymentProcessor**: Xử lý thanh toán online (VNPay, Momo, ZaloPay)
- **CODPaymentProcessor**: Xử lý thanh toán COD

### 5. Client (PaymentService)

Facade class để tạo và quản lý payment processors:

```csharp
public class PaymentService
{
    public PaymentProcessor CreatePaymentProcessor(
        PaymentMethod method, 
        PaymentProviderType providerType)
    {
        var provider = _providers[providerType];
        
        return method switch
        {
            PaymentMethod.Online => new OnlinePaymentProcessor(provider, _logger),
            PaymentMethod.COD => new CODPaymentProcessor(provider, _logger),
            _ => throw new ArgumentException()
        };
    }
}
```

## 💡 Benefits of Bridge Pattern

### 1. **Decoupling**
- Tách biệt payment method (Online, COD, Wallet) khỏi provider (VNPay, Momo, ZaloPay)
- Thay đổi provider không ảnh hưởng đến payment method logic

### 2. **Extensibility**
- Dễ dàng thêm payment provider mới:
  ```csharp
  public class MomoProvider : IPaymentProvider { }
  ```
- Dễ dàng thêm payment method mới:
  ```csharp
  public class WalletPaymentProcessor : PaymentProcessor { }
  ```

### 3. **Avoid Class Explosion**
Không có Bridge Pattern:
```
- VNPayOnlinePayment
- VNPayCODPayment
- MomoOnlinePayment
- MomoCODPayment
- ZaloPayOnlinePayment
- ZaloPayCODPayment
= 6 classes (3 providers × 2 methods)
```

Với Bridge Pattern:
```
- VNPayProvider + OnlinePaymentProcessor
- MomoProvider + OnlinePaymentProcessor
- CODProvider + CODPaymentProcessor
= 5 components (3 providers + 2 processors)
```

### 4. **Runtime Configuration**
Có thể chọn provider và method tại runtime:
```csharp
var processor = _paymentService.CreatePaymentProcessor(
    PaymentMethod.Online,        // Chọn method
    PaymentProviderType.VNPay    // Chọn provider
);
```

## 🚀 Usage Examples

### Example 1: Online Payment with VNPay

```csharp
var result = await _paymentService.ProcessPaymentAsync(
    PaymentMethod.Online,
    PaymentProviderType.VNPay,
    new PaymentRequest
    {
        OrderId = 123,
        Amount = 1000000,
        OrderInfo = "Thanh toán đơn hàng #123",
        IpAddress = "192.168.1.1"
    }
);
```

### Example 2: COD Payment

```csharp
var result = await _paymentService.ProcessPaymentAsync(
    PaymentMethod.COD,
    PaymentProviderType.COD,
    new PaymentRequest
    {
        OrderId = 124,
        Amount = 500000,
        OrderInfo = "Thanh toán COD đơn hàng #124"
    }
);
```

### Example 3: Future - Online Payment with Momo

```csharp
// Chỉ cần implement MomoProvider và đăng ký DI
var result = await _paymentService.ProcessPaymentAsync(
    PaymentMethod.Online,        // Dùng lại processor
    PaymentProviderType.Momo,    // Provider mới
    paymentRequest
);
```

## 🔧 API Endpoints

### 1. Get Available Providers
```http
GET /api/payment/providers
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "providerType": "VNPay",
      "providerName": "VNPay",
      "isAvailable": true
    },
    {
      "providerType": "COD",
      "providerName": "COD",
      "isAvailable": true
    }
  ]
}
```

### 2. Create Payment URL (New)
```http
POST /api/payment/create-payment-url
Content-Type: application/json

{
  "orderId": 123,
  "paymentMethod": "Online",
  "providerType": "VNPay"
}
```

### 3. Create VNPay URL (Legacy - Backward Compatible)
```http
POST /api/payment/create-vnpay-url
Content-Type: application/json

{
  "orderId": 123
}
```

## 🎯 Extension Points

### Adding a New Provider (e.g., Momo)

1. **Create Provider Class**:
```csharp
public class MomoProvider : IPaymentProvider
{
    public string ProviderName => "Momo";
    
    public async Task<PaymentUrlResult> CreatePaymentUrlAsync(PaymentRequest request)
    {
        // Momo-specific implementation
    }
    
    public async Task<PaymentValidationResult> ValidatePaymentResponseAsync(...)
    {
        // Momo-specific validation
    }
    
    public async Task<bool> IsAvailableAsync() => true;
}
```

2. **Register in DI**:
```csharp
builder.Services.AddScoped<MomoProvider>();
```

3. **Add to PaymentService**:
```csharp
_providers = new Dictionary<PaymentProviderType, IPaymentProvider>
{
    { PaymentProviderType.VNPay, vnPayProvider },
    { PaymentProviderType.Momo, momoProvider },  // ← Add here
    { PaymentProviderType.COD, codProvider }
};
```

### Adding a New Payment Method (e.g., Wallet)

```csharp
public class WalletPaymentProcessor : PaymentProcessor
{
    public override PaymentMethod GetPaymentMethod() => PaymentMethod.Wallet;
    
    protected override string? ValidatePaymentRequest(PaymentRequest request)
    {
        // Wallet-specific validation
        if (request.Amount > 20_000_000)
            return "Wallet payment limit exceeded";
        
        return base.ValidatePaymentRequest(request);
    }
}
```

## 📊 Dependency Injection Setup

```csharp
// Program.cs
builder.Services.AddScoped<VNPayProvider>();
builder.Services.AddScoped<CODProvider>();
builder.Services.AddScoped<MomoProvider>();  // Future
builder.Services.AddScoped<PaymentService>();
```

## ✅ Backward Compatibility

Old code sử dụng `VNPayService` vẫn hoạt động:
```csharp
// Old - still works
builder.Services.AddScoped<VNPayService>();

// Controller
public PaymentController(VNPayService vnPayService) { }
```

New code sử dụng Bridge Pattern:
```csharp
// New - recommended
builder.Services.AddScoped<PaymentService>();

// Controller
public PaymentController(PaymentService paymentService) { }
```

## 🧪 Testing Bridge Pattern

```csharp
// Mock provider
var mockProvider = new Mock<IPaymentProvider>();
mockProvider.Setup(p => p.CreatePaymentUrlAsync(It.IsAny<PaymentRequest>()))
    .ReturnsAsync(new PaymentUrlResult { Success = true });

// Test processor with mock
var processor = new OnlinePaymentProcessor(mockProvider.Object, logger);
var result = await processor.ProcessPaymentAsync(request);

Assert.True(result.Success);
```

## 🎓 Learning Resources

- [Bridge Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/bridge)
- [Bridge Pattern - C# Examples](https://www.dofactory.com/net/bridge-design-pattern)

## 📝 Notes

- **VNPayService.cs** (old file) có thể giữ lại cho backward compatibility
- **PaymentController** hỗ trợ cả endpoint mới và cũ
- Bridge Pattern giúp scale hệ thống payment dễ dàng trong tương lai
