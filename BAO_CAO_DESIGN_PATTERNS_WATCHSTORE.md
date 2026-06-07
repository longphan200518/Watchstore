# BÁO CÁO ĐỒ ÁN MÔN HỌC

## MẪU THIẾT KẾ PHẦN MỀM / DESIGN PATTERNS

---

### TRANG BÌA

**TRƯỜNG ĐẠI HỌC NGOẠI NGỮ - TIN HỌC TP.HCM**
**(HUFLIT)**

---

**Tên môn học:** Mẫu Thiết Kế Phần Mềm / Design Patterns

**Đề tài:** Nghiên cứu và ứng dụng các Design Patterns trong phát triển hệ thống Watchstore E-commerce

---

**Nhóm sinh viên thực hiện:**

- Phan Văn Hoàng Long
- Ngô Xuân Hải

**Giảng viên hướng dẫn:** [Tên giảng viên]

**TP. Hồ Chí Minh, năm 2026**

---

## MỤC LỤC

1. LỜI MỞ ĐẦU
2. CHƯƠNG 1: TỔNG QUAN VỀ DESIGN PATTERNS
3. CHƯƠNG 2: PHÂN TÍCH CÁC MẪU THIẾT KẾ
   - 2.1. Singleton Pattern
   - 2.2. Factory Pattern
   - 2.3. Builder Pattern
   - 2.4. Facade Pattern
   - 2.5. Repository Pattern
   - 2.6. Unit of Work Pattern
   - 2.7. Strategy Pattern
   - 2.8. Template Method Pattern
4. CHƯƠNG 3: ỨNG DỤNG THỰC TẾ - DỰ ÁN WATCHSTORE
5. BẢNG PHÂN CÔNG CÔNG VIỆC
6. KẾT LUẬN
7. TÀI LIỆU THAM KHẢO

---

## 1. LỜI MỞ ĐẦU

### 1.1. Lý do chọn đề tài

Trong quá trình phát triển phần mềm hiện đại, việc xây dựng các hệ thống phức tạp, dễ bảo trì và mở rộng là một thách thức lớn. Design Patterns (Mẫu thiết kế) đã được chứng minh là giải pháp hiệu quả để giải quyết các vấn đề lặp lại trong thiết kế phần mềm.

Nhóm chúng em đã chọn đề tài "Nghiên cứu và ứng dụng các Design Patterns" với mục đích:

- Hiểu sâu về các mẫu thiết kế phổ biến
- Áp dụng thực tế vào dự án Watchstore E-commerce
- Trải nghiệm quy trình phát triển phần mềm chuyên nghiệp

### 1.2. Mục tiêu báo cáo

- Nghiên cứu 8 Design Patterns chính: Singleton, Factory, Builder, Facade, Repository, Unit of Work, Strategy, Template Method
- Triển khai các patterns trong hệ thống thực tế Watchstore
- Phân tích ưu nhược điểm và trường hợp sử dụng
- Đánh giá hiệu quả của việc áp dụng patterns

### 1.3. Phạm vi nghiên cứu

- **Công nghệ:** .NET 8, Entity Framework Core, React 18
- **Kiến trúc:** Clean Architecture (4 layers)
- **Patterns:** 8 patterns thuộc 3 nhóm Creational, Structural, Behavioral
- **Dự án:** Hệ thống E-commerce bán đồng hồ với Backend API + Frontend (Admin & User)

---

## CHƯƠNG 1: TỔNG QUAN VỀ DESIGN PATTERNS

### 1.1. Design Pattern là gì?

Design Pattern (Mẫu thiết kế) là các giải pháp tổng quát, có thể tái sử dụng cho các vấn đề thường gặp trong thiết kế phần mềm. Chúng không phải là code hoàn chỉnh mà là mẫu mô tả cách giải quyết vấn đề có thể áp dụng trong nhiều tình huống khác nhau.

**Đặc điểm:**

- Đã được kiểm chứng qua thời gian
- Độc lập với ngôn ngữ lập trình cụ thể
- Cung cấp vocabulary chung cho developers
- Tăng khả năng tái sử dụng và bảo trì code

### 1.2. Lịch sử ra đời - Gang of Four (GoF)

Năm 1994, bốn tác giả Erich Gamma, Richard Helm, Ralph Johnson, và John Vlissides (được gọi là "Gang of Four" - GoF) đã xuất bản cuốn sách "Design Patterns: Elements of Reusable Object-Oriented Software", giới thiệu 23 design patterns cơ bản.

### 1.3. Tại sao cần dùng Design Patterns?

**Ưu điểm:**

- ✅ **Tái sử dụng code**: Giảm duplicate code, tăng productivity
- ✅ **Dễ bảo trì**: Code có cấu trúc rõ ràng, dễ hiểu
- ✅ **Mở rộng linh hoạt**: Dễ dàng thêm features mới
- ✅ **Giao tiếp hiệu quả**: Terminology chung trong team
- ✅ **Giảm bugs**: Sử dụng giải pháp đã được kiểm chứng

**Nhược điểm:**

- ❌ Có thể làm code phức tạp hơn nếu áp dụng sai chỗ
- ❌ Cần thời gian học và hiểu rõ
- ❌ Over-engineering nếu lạm dụng

### 1.4. Phân loại Design Patterns

**1. Creational Patterns (Nhóm Khởi tạo):**

- Singleton, Factory Method, Abstract Factory, Builder, Prototype
- Mục đích: Quản lý cách tạo đối tượng

**2. Structural Patterns (Nhóm Cấu trúc):**

- Adapter, Bridge, Composite, Decorator, Facade, Proxy
- Mục đích: Tổ chức quan hệ giữa các đối tượng

**3. Behavioral Patterns (Nhóm Hành vi):**

- Strategy, Observer, Command, Template Method, Iterator, State
- Mục đích: Quản lý thuật toán và trách nhiệm giữa các đối tượng

---

## CHƯƠNG 2: PHÂN TÍCH CÁC MẪU THIẾT KẾ

---

### 2.1. SINGLETON PATTERN

#### 2.1.1. Phân loại

**Creational Pattern** - Mẫu khởi tạo

#### 2.1.2. Khái niệm

Singleton đảm bảo một class chỉ có đúng một instance trong toàn bộ vòng đời ứng dụng và cung cấp một điểm truy cập toàn cục đến instance đó.

#### 2.1.3. Vấn đề giải quyết (Problem)

Trong một số tình huống, chúng ta cần đảm bảo một class chỉ có **duy nhất một instance** trong toàn bộ ứng dụng, ví dụ:

- Logging service
- Database connection pool
- Configuration manager
- Cache manager

Nếu tạo nhiều instances có thể dẫn đến:

- Lãng phí tài nguyên hệ thống
- Xung đột dữ liệu
- Khó kiểm soát trạng thái

#### 2.1.4. Giải pháp (Solution)

Singleton Pattern đảm bảo:

1. Class chỉ có một instance duy nhất
2. Cung cấp global access point đến instance đó
3. Lazy initialization (chỉ tạo khi cần)

**UML Class Diagram:**

```
┌─────────────────────────┐
│      Singleton          │
├─────────────────────────┤
│ - instance: Singleton   │
│ - Singleton()           │  (private constructor)
├─────────────────────────┤
│ + GetInstance(): Singleton │
│ + DoSomething()         │
└─────────────────────────┘
```

#### 2.1.5. Code ví dụ từ Watchstore

**File:** [WatchStore.Application/Services/LoggingService.cs](backend/WatchStore.Application/Services/LoggingService.cs)

```csharp
public class LoggingService : ILoggingService
{
    private readonly ILogger<LoggingService> _logger;
    private static LoggingService? _instance;
    private static readonly object _lock = new object();

    // Private constructor prevents external instantiation
    private LoggingService(ILogger<LoggingService> logger)
    {
        _logger = logger;
    }

    // Thread-safe Singleton instance getter
    public static LoggingService GetInstance(ILogger<LoggingService> logger)
    {
        if (_instance == null)
        {
            lock (_lock)
            {
                if (_instance == null)
                {
                    _instance = new LoggingService(logger);
                }
            }
        }
        return _instance;
    }

    public void LogInformation(string message, params object[] args)
    {
        _logger.LogInformation(message, args);
    }

    public void LogWarning(string message, params object[] args)
    {
        _logger.LogWarning(message, args);
    }

    public void LogError(Exception ex, string message, params object[] args)
    {
        _logger.LogError(ex, message, args);
    }
}
```

**Đăng ký trong Program.cs:**

```csharp
builder.Services.AddSingleton<ILoggingService>(serviceProvider =>
{
    var logger = serviceProvider.GetRequiredService<ILogger<LoggingService>>();
    return LoggingService.GetInstance(logger);
});
```

#### 2.1.6. Vì sao đây là Singleton trong dự án

- Chỉ một `LoggingService` được dùng xuyên suốt application.
- Instance được giữ qua biến tĩnh `_instance`.
- Constructor được `private` để ngăn tạo object từ bên ngoài.
- DI container chỉ trả về cùng một instance đã khởi tạo.

#### 2.1.7. Thành phần tham gia

1. **Singleton Class**: `LoggingService`
2. **Static Instance**: `_instance` - lưu trữ instance duy nhất
3. **Private Constructor**: Ngăn tạo object từ bên ngoài
4. **GetInstance() Method**: Cung cấp access point

#### 2.1.8. Ưu nhược điểm

**Ưu điểm:**

- ✅ Tiết kiệm tài nguyên (chỉ 1 instance)
- ✅ Global access dễ dàng
- ✅ Thread-safe với Double-checked locking
- ✅ Lazy initialization

**Nhược điểm:**

- ❌ Vi phạm Single Responsibility Principle
- ❌ Khó test (global state)
- ❌ Có thể gây vấn đề trong môi trường multi-threaded

#### 2.1.9. Trường hợp sử dụng thực tế

✅ **Nên dùng:**

- Database connection pools
- Logger services
- Configuration managers
- Thread pools
- Caching systems

❌ **Không nên dùng:**

- Khi cần nhiều instances với cấu hình khác nhau
- Khi cần dependency injection linh hoạt
- Khi testing là ưu tiên hàng đầu

---

### 2.2. FACTORY PATTERN

#### 2.2.1. Phân loại

**Creational Pattern** - Mẫu khởi tạo

#### 2.2.2. Khái niệm

Factory tách việc tạo object ra khỏi nơi sử dụng object đó. Client chỉ gọi factory và không cần biết class cụ thể nào được khởi tạo.

#### 2.2.3. Vấn đề giải quyết (Problem)

Khi cần tạo đối tượng nhưng:

- Không muốn expose logic khởi tạo phức tạp
- Cần quyết định loại object tạo ra tại runtime
- Muốn tập trung logic tạo object ở một nơi

Ví dụ: Hệ thống thanh toán cần tạo các PaymentProcessor khác nhau (VNPay, COD, Momo) dựa trên lựa chọn người dùng.

#### 2.2.4. Giải pháp (Solution)

Factory Pattern cung cấp interface để tạo objects, nhưng để subclass quyết định class nào sẽ được khởi tạo.

**UML Class Diagram:**

```
        ┌──────────────────┐
        │  PaymentService  │
        │   (Factory)      │
        ├──────────────────┤
        │ + CreatePayment- │
        │   Processor()    │
        └────────┬─────────┘
                 │ creates
        ┌────────┴─────────┐
        │ PaymentProcessor │
        │   (Abstract)     │
        └────────┬─────────┘
                 │
         ┌───────┴───────┐
         │               │
┌────────┴──────┐  ┌────┴────────┐
│ OnlinePayment │  │ CODPayment  │
│  Processor    │  │  Processor  │
└───────────────┘  └─────────────┘
```

#### 2.2.5. Code ví dụ từ Watchstore

**File:** [WatchStore.Application/Services/Payment/PaymentService.cs](backend/WatchStore.Application/Services/Payment/PaymentService.cs)

```csharp
public class PaymentService
{
    private readonly Dictionary<PaymentProviderType, IPaymentProvider> _providers;
    private readonly ILogger<PaymentProcessor> _logger;

    public PaymentService(
        VNPayProvider vnPayProvider,
        CODProvider codProvider,
        ILogger<PaymentProcessor> logger)
    {
        _providers = new Dictionary<PaymentProviderType, IPaymentProvider>
        {
            { PaymentProviderType.VNPay, vnPayProvider },
            { PaymentProviderType.COD, codProvider }
        };
        _logger = logger;
    }

    // Factory Method - Creates appropriate PaymentProcessor
    public PaymentProcessor CreatePaymentProcessor(
        PaymentMethod method,
        PaymentProviderType providerType)
    {
        if (!_providers.ContainsKey(providerType))
        {
            throw new ArgumentException(
                $"Payment provider {providerType} is not supported");
        }

        var provider = _providers[providerType];

        // Factory logic: decide which concrete class to instantiate
        return method switch
        {
            PaymentMethod.Online =>
                new OnlinePaymentProcessor(provider, _logger),
            PaymentMethod.COD =>
                new CODPaymentProcessor(provider, _logger),
            _ => throw new ArgumentException(
                $"Payment method {method} is not supported")
        };
    }

    public async Task<PaymentUrlResult> ProcessPaymentAsync(
        PaymentMethod method,
        PaymentProviderType providerType,
        PaymentRequest request)
    {
        var processor = CreatePaymentProcessor(method, providerType);
        return await processor.ProcessPaymentAsync(request);
    }
}
```

Ngoài payment, dự án còn dùng factory cho email message ở [EmailMessageFactory.cs](backend/WatchStore.Application/Features/Auth/EmailMessages/EmailMessageFactory.cs) để tạo đúng loại email theo từng nghiệp vụ như xác thực OTP, đặt lại mật khẩu, xác nhận đơn hàng.

#### 2.2.6. Thành phần tham gia

1. **Factory (PaymentService)**: Chứa factory method
2. **Product Interface (PaymentProcessor)**: Định nghĩa interface chung
3. **Concrete Products**: `OnlinePaymentProcessor`, `CODPaymentProcessor`
4. **Client**: Sử dụng factory để tạo objects
5. **Email Factory**: `EmailMessageFactory` tạo các object email chuyên biệt

#### 2.2.7. Ưu nhược điểm

**Ưu điểm:**

- ✅ Loose coupling giữa creator và products
- ✅ Single Responsibility: Logic tạo object tập trung
- ✅ Open/Closed Principle: Dễ mở rộng thêm products mới
- ✅ Ẩn complexity của việc khởi tạo

**Nhược điểm:**

- ❌ Tăng số lượng classes
- ❌ Code phức tạp hơn với simple use cases

#### 2.2.8. Trường hợp sử dụng thực tế

✅ **Watchstore sử dụng trong:**

- Payment processing (VNPay, COD, Momo, ZaloPay)
- Notification services (Email, SMS, Push)
- File exporters (PDF, Excel, CSV)

---

### 2.3. BUILDER PATTERN

#### 2.3.1. Phân loại

**Creational Pattern** - Mẫu khởi tạo

#### 2.3.2. Khái niệm

Builder cho phép xây dựng object phức tạp theo từng bước, đặc biệt hữu ích khi object có nhiều thuộc tính và quy tắc cấu hình.

#### 2.3.3. Vấn đề giải quyết (Problem)

Khi cần tạo object phức tạp với nhiều bước:

- Object có nhiều thuộc tính optional
- Cần tạo object theo từng bước rõ ràng
- Muốn tách riêng construction logic khỏi representation

#### 2.3.4. Giải pháp (Solution)

Builder Pattern cho phép xây dựng object từng bước một cách rõ ràng.

#### 2.3.5. Code ví dụ từ Watchstore

Trong Watchstore, Builder pattern được sử dụng implicit thông qua **Fluent API** của Entity Framework trong [WatchStoreDbContext.cs](backend/WatchStore.Infrastructure/Data/WatchStoreDbContext.cs).

**File:** [WatchStore.Infrastructure/Data/WatchStoreDbContext.cs](backend/WatchStore.Infrastructure/Data/WatchStoreDbContext.cs)

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<Watch>(entity =>
    {
        entity.HasKey(e => e.Id);

        entity.Property(e => e.Name)
        .IsRequired()
        .HasMaxLength(300);

        entity.Property(e => e.Price)
        .HasColumnType("decimal(18,2)");

        entity.HasOne(e => e.Brand)
        .WithMany(b => b.Watches)
        .HasForeignKey(e => e.BrandId)
        .OnDelete(DeleteBehavior.Restrict);

      entity.HasQueryFilter(e => !e.IsDeleted);
    });
}
```

Builder cũng xuất hiện ở các entity khác trong cùng file như `Brand`, `Order`, `Review`, `Coupon`, `WebsiteSettings` khi cấu hình key, relationship, index và query filter.

#### 2.3.6. Thành phần tham gia

1. **Builder**: `ModelBuilder` và `EntityTypeBuilder`
2. **Product**: Cấu hình entity model trong EF Core
3. **Client**: `WatchStoreDbContext.OnModelCreating`

#### 2.3.7. Ưu nhược điểm

**Ưu điểm:**

- ✅ Tổ chức cấu hình entity rõ ràng
- ✅ Dễ đọc và dễ bảo trì
- ✅ Mỗi entity được cấu hình tách biệt
- ✅ Hỗ trợ chaining, code ngắn gọn

**Nhược điểm:**

- ❌ File DbContext có thể dài nếu nhiều entity
- ❌ Không nên lạm dụng quá nhiều cấu hình rải rác

#### 2.3.8. Trường hợp sử dụng thực tế

- Cấu hình bảng và quan hệ trong Entity Framework Core
- Xây dựng object phức tạp từng bước
- Tạo request/response object cần nhiều bước set giá trị

---

### 2.4. FACADE PATTERN

#### 2.4.1. Phân loại

**Structural Pattern** - Mẫu cấu trúc

#### 2.4.2. Khái niệm

Facade cung cấp một lớp trung gian với interface đơn giản để che giấu độ phức tạp của nhiều subsystem bên dưới.

#### 2.4.3. Vấn đề giải quyết (Problem)

Trong hệ thống phức tạp, một service thường cần inject nhiều dependencies, gây ra constructor hell và vi phạm DRY principle.

#### 2.4.4. Giải pháp (Solution)

Facade Pattern cung cấp **unified interface** đơn giản hóa việc sử dụng subsystem phức tạp.

#### 2.4.5. Code ví dụ từ Watchstore

**Interface:** [WatchStore.Application/Common/IServiceFacade.cs](backend/WatchStore.Application/Common/IServiceFacade.cs)

```csharp
public interface IServiceFacade
{
    // Core Infrastructure
    IUnitOfWork UnitOfWork { get; }
    IMemoryCache Cache { get; }
    IConfiguration Configuration { get; }

    // Identity Services
    UserManager<User> UserManager { get; }
    SignInManager<User> SignInManager { get; }
    RoleManager<Role> RoleManager { get; }

    // Application Services
    IJwtService JwtService { get; }
    IEmailService EmailService { get; }
    ILoggingService LoggingService { get; }

    // Generic Logger Factory
    ILogger<T> GetLogger<T>();
}
```

**Implementation:** [WatchStore.Application/Common/ServiceFacade.cs](backend/WatchStore.Application/Common/ServiceFacade.cs)

```csharp
public class ServiceFacade : IServiceFacade
{
    public IUnitOfWork UnitOfWork { get; }
    public IMemoryCache Cache { get; }
    public IConfiguration Configuration { get; }
    public UserManager<User> UserManager { get; }
    public SignInManager<User> SignInManager { get; }
    public RoleManager<Role> RoleManager { get; }
    public IJwtService JwtService { get; }
    public IEmailService EmailService { get; }
    public ILoggingService LoggingService { get; }

    private readonly ILoggerFactory _loggerFactory;

    public ServiceFacade(
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        IConfiguration configuration,
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        RoleManager<Role> roleManager,
        IJwtService jwtService,
        IEmailService emailService,
        ILoggingService loggingService,
        ILoggerFactory loggerFactory)
    {
        UnitOfWork = unitOfWork;
        Cache = cache;
        Configuration = configuration;
        UserManager = userManager;
        SignInManager = signInManager;
        RoleManager = roleManager;
        JwtService = jwtService;
        EmailService = emailService;
        LoggingService = loggingService;
        _loggerFactory = loggerFactory;
    }

    public ILogger<T> GetLogger<T>()
    {
        return _loggerFactory.CreateLogger<T>();
    }
}
```

**Usage trong Services:**

```csharp
public class WatchService : BaseService, IWatchService
{
    private readonly IRepository<Watch> _watchRepository;

    // ✅ Chỉ cần 1 dependency!
    public WatchService(IServiceFacade facade)
        : base(facade, facade.GetLogger<WatchService>())
    {
        _watchRepository = facade.UnitOfWork.GetRepository<Watch>();
    }
}
```

#### 2.4.6. Vì sao đây là Facade trong dự án

- Service nghiệp vụ chỉ phụ thuộc vào một đối tượng `IServiceFacade` thay vì nhiều dependency riêng lẻ.
- `ServiceFacade` gom các dịch vụ hạ tầng và ứng dụng quan trọng vào một điểm truy cập duy nhất.
- Các service như `WatchService`, `ReviewService`, `CouponService` dùng facade để lấy repository, logger, cache, jwt, email service.

#### 2.4.7. Thành phần tham gia

1. **Facade**: `ServiceFacade`
2. **Subsystems**: `IUnitOfWork`, `IMemoryCache`, `IConfiguration`, `UserManager`, `SignInManager`, `RoleManager`, `IJwtService`, `IEmailService`, `ILoggingService`
3. **Client**: Các service nghiệp vụ trong Application layer

#### 2.4.8. Ưu nhược điểm

**Ưu điểm:**

- ✅ Giảm complexity cho client code
- ✅ Loose coupling giữa clients và subsystems
- ✅ DRY - không duplicate dependencies
- ✅ Dễ maintain và test

**Nhược điểm:**

- ❌ Facade có thể trở thành "God Object" nếu quá lớn
- ❌ Thêm một layer abstraction

#### 2.4.9. Trường hợp sử dụng thực tế

- Khi service cần nhiều dependency liên quan đến cùng một ngữ cảnh nghiệp vụ
- Khi muốn chuẩn hóa cách truy cập hạ tầng trong Application layer
- Khi cần giảm độ phức tạp của constructor injection

---

### 2.5. REPOSITORY PATTERN

#### 2.5.1. Phân loại

**Structural Pattern** - Mẫu cấu trúc

#### 2.5.2. Vấn đề giải quyết (Problem)

**Vấn đề:**

- Business logic trộn lẫn với data access code
- Khó test vì phụ thuộc trực tiếp vào database
- Duplicate data access code khắp nơi
- Khó thay đổi data source (SQL Server → MongoDB)

#### 2.5.3. Giải pháp (Solution)

Repository Pattern tạo **abstraction layer** giữa business logic và data access, như một "collection in-memory" của domain objects.

#### 2.5.4. Code ví dụ từ Watchstore

**Interface:** `WatchStore.Domain/Interfaces/IRepository.cs`

```csharp
public interface IRepository<T> where T : class
{
    // Query operations
    Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> FindAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default);

    // Command operations
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(T entity, CancellationToken cancellationToken = default);

    // Advanced
    IQueryable<T> GetQueryable();
    Task<T?> GetBySpecAsync(
        ISpecification<T> spec,
        CancellationToken cancellationToken = default);
}
```

**Implementation:** `WatchStore.Infrastructure/Repositories/Repository.cs`

```csharp
public class Repository<T> : IRepository<T> where T : class
{
    protected readonly WatchStoreDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(WatchStoreDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.ToListAsync(cancellationToken);
    }

    public virtual async Task<T> AddAsync(
        T entity,
        CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        return entity;
    }

    public virtual Task UpdateAsync(
        T entity,
        CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        return Task.CompletedTask;
    }

    public virtual Task DeleteAsync(
        T entity,
        CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(entity);
        return Task.CompletedTask;
    }

    public virtual IQueryable<T> GetQueryable()
    {
        return _dbSet.AsNoTracking();
    }
}
```

#### 2.5.5. Ưu nhược điểm

**Ưu điểm:**

- ✅ Separation of Concerns: Business logic tách khỏi data access
- ✅ Testability: Dễ mock repository cho unit tests
- ✅ Centralized data access logic
- ✅ Flexibility: Dễ thay đổi data source
- ✅ DRY: Tái sử dụng queries

**Nhược điểm:**

- ❌ Thêm abstraction layer (có thể overkill cho simple apps)
- ❌ Có thể duplicate EF Core functionality

---

### 2.6. UNIT OF WORK PATTERN

#### 2.6.1. Phân loại

**Behavioral Pattern** - Mẫu hành vi

#### 2.6.2. Vấn đề giải quyết (Problem)

Khi thực hiện nhiều operations trên database:

- Cần đảm bảo **atomicity** (tất cả thành công hoặc tất cả rollback)
- Mỗi repository gọi `SaveChanges()` riêng → data inconsistency
- Khó quản lý transactions

#### 2.6.3. Giải pháp (Solution)

Unit of Work Pattern quản lý:

- Một **transaction** cho nhiều repository operations
- Chỉ **commit một lần** khi tất cả operations thành công
- **Rollback** nếu có bất kỳ lỗi nào

#### 2.6.4. Code ví dụ từ Watchstore

**Interface:** `WatchStore.Domain/Interfaces/IUnitOfWork.cs`

```csharp
public interface IUnitOfWork : IDisposable
{
    // Repository access
    IRepository<T> GetRepository<T>() where T : class;

    // Specific repositories (commonly used)
    IRepository<OtpVerification> OtpVerifications { get; }
    IRepository<RefreshToken> RefreshTokens { get; }

    // Transaction management
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitAsync(CancellationToken cancellationToken = default);
    Task RollbackAsync(CancellationToken cancellationToken = default);
}
```

**Implementation:** `WatchStore.Infrastructure/Repositories/UnitOfWork.cs`

```csharp
public class UnitOfWork : IUnitOfWork
{
    private readonly WatchStoreDbContext _context;
    private IDbContextTransaction? _transaction;
    private readonly Dictionary<Type, object> _repositories;

    public UnitOfWork(WatchStoreDbContext context)
    {
        _context = context;
        _repositories = new Dictionary<Type, object>();
    }

    public IRepository<T> GetRepository<T>() where T : class
    {
        var type = typeof(T);

        if (!_repositories.ContainsKey(type))
        {
            _repositories[type] = new Repository<T>(_context);
        }

        return (IRepository<T>)_repositories[type];
    }

    public async Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(
        CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database
            .BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _context.SaveChangesAsync(cancellationToken);

            if (_transaction != null)
            {
                await _transaction.CommitAsync(cancellationToken);
            }
        }
        catch
        {
            await RollbackAsync(cancellationToken);
            throw;
        }
        finally
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }
    }

    public async Task RollbackAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
```

**Usage Example - Order Service:**

```csharp
public async Task<ApiResponse<OrderDto>> CreateOrderAsync(CreateOrderDto dto)
{
    try
    {
        // ✅ Begin transaction
        await Facade.UnitOfWork.BeginTransactionAsync();

        // Step 1: Create order
        var order = new Order { ... };
        await _orderRepository.AddAsync(order);

        // Step 2: Create order items and update stock
        foreach (var item in dto.Items)
        {
            var orderItem = new OrderItem { ... };
            await _orderItemRepository.AddAsync(orderItem);

            var watch = await _watchRepository.GetByIdAsync(item.WatchId);
            watch.StockQuantity -= item.Quantity;
            await _watchRepository.UpdateAsync(watch);
        }

        // ✅ Commit all changes atomically
        await Facade.UnitOfWork.CommitAsync();

        return ApiResponse<OrderDto>.Success(MapToDto(order));
    }
    catch
    {
        // ✅ Rollback on error
        await Facade.UnitOfWork.RollbackAsync();
        throw;
    }
}
```

#### 2.6.5. Ưu nhược điểm

**Ưu điểm:**

- ✅ **Atomicity**: All-or-nothing transactions
- ✅ **Data consistency**: Đảm bảo integrity
- ✅ **Centralized transaction management**
- ✅ **Performance**: Batch operations, single commit
- ✅ **Testability**: Dễ mock UoW

**Nhược điểm:**

- ❌ Thêm complexity
- ❌ Potential deadlocks với long transactions
- ❌ Over-abstraction cho simple CRUD

---

### 2.7. STRATEGY PATTERN

#### 2.7.1. Phân loại

**Behavioral Pattern** - Mẫu hành vi

#### 2.7.2. Vấn đề giải quyết (Problem)

Khi có nhiều **algorithms/strategies** khác nhau cho cùng một task:

- Payment methods: VNPay, COD, Momo, ZaloPay
- Sorting algorithms: QuickSort, MergeSort, BubbleSort
- Discount calculations: Percentage, Fixed, Tiered

#### 2.7.3. Giải pháp (Solution)

Strategy Pattern cho phép:

- Định nghĩa family of algorithms
- Encapsulate mỗi algorithm
- Interchangeable at runtime

#### 2.7.4. Code ví dụ từ Watchstore

**Strategy Interface:** `IPaymentProvider.cs`

```csharp
public interface IPaymentProvider
{
    string ProviderName { get; }

    Task<PaymentUrlResult> CreatePaymentUrlAsync(PaymentRequest request);

    Task<PaymentValidationResult> ValidatePaymentResponseAsync(
        Dictionary<string, string> responseData);

    Task<bool> IsAvailableAsync();
}
```

**Concrete Strategy:** `VNPayProvider.cs`

```csharp
public class VNPayProvider : IPaymentProvider
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<VNPayProvider> _logger;

    public string ProviderName => "VNPay";

    public async Task<PaymentUrlResult> CreatePaymentUrlAsync(
        PaymentRequest request)
    {
        var vnpay = new VNPayLibrary();

        vnpay.AddRequestData("vnp_Version", "2.1.0");
        vnpay.AddRequestData("vnp_Amount",
            ((long)(request.Amount * 100)).ToString());
        // ... VNPay specific logic

        var paymentUrl = vnpay.CreateRequestUrl(
            _configuration["VNPay:Url"],
            _configuration["VNPay:HashSecret"]);

        return new PaymentUrlResult
        {
            Success = true,
            PaymentUrl = paymentUrl
        };
    }
}
```

**Context Class:** `PaymentService.cs`

```csharp
public class PaymentService
{
    private readonly Dictionary<PaymentProviderType, IPaymentProvider> _providers;

    public PaymentService(
        VNPayProvider vnPayProvider,
        CODProvider codProvider)
    {
        _providers = new Dictionary<PaymentProviderType, IPaymentProvider>
        {
            { PaymentProviderType.VNPay, vnPayProvider },
            { PaymentProviderType.COD, codProvider }
        };
    }

    // Strategy selection at runtime
    public async Task<PaymentUrlResult> ProcessPaymentAsync(
        PaymentProviderType providerType,
        PaymentRequest request)
    {
        var provider = _providers[providerType];
        return await provider.CreatePaymentUrlAsync(request);
    }
}
```

#### 2.7.5. Ưu nhược điểm

**Ưu điểm:**

- ✅ **Open/Closed Principle**: Dễ thêm strategies mới
- ✅ **Runtime flexibility**: Switch strategies at runtime
- ✅ **Testability**: Test từng strategy độc lập
- ✅ **Clean code**: Loại bỏ conditional statements

**Nhược điểm:**

- ❌ Tăng số lượng classes
- ❌ Client phải aware of strategies
- ❌ Overhead nhỏ khi chỉ có ít strategies

---

### 2.8. TEMPLATE METHOD PATTERN

#### 2.8.1. Phân loại

**Behavioral Pattern** - Mẫu hành vi

#### 2.8.2. Vấn đề giải quyết (Problem)

Khi có nhiều classes với **algorithm tương tự** nhưng khác nhau ở một số bước:

- Duplicate code giữa các subclasses
- Khó maintain khi thay đổi common logic
- Vi phạm DRY principle

#### 2.8.3. Giải pháp (Solution)

Template Method Pattern định nghĩa **skeleton** của algorithm trong base class, để subclasses override specific steps.

#### 2.8.4. Code ví dụ từ Watchstore

**Abstract Base Class (Template):** `PaymentProcessor.cs`

```csharp
public abstract class PaymentProcessor
{
    protected readonly IPaymentProvider _provider;
    protected readonly ILogger<PaymentProcessor> _logger;

    // TEMPLATE METHOD - Defines algorithm skeleton
    public async Task<PaymentUrlResult> ProcessPaymentAsync(
        PaymentRequest request)
    {
        _logger.LogInformation("Processing payment for {OrderId}",
            request.OrderId);

        // Step 1: Hook method (can be overridden)
        await BeforeProcessPaymentAsync(request);

        // Step 2: Check provider availability (concrete step)
        if (!await _provider.IsAvailableAsync())
        {
            return new PaymentUrlResult
            {
                Success = false,
                ErrorMessage = "Provider is not available"
            };
        }

        // Step 3: Validate request (hook - can be overridden)
        var validationError = ValidatePaymentRequest(request);
        if (!string.IsNullOrEmpty(validationError))
        {
            return new PaymentUrlResult
            {
                Success = false,
                ErrorMessage = validationError
            };
        }

        // Step 4: Execute provider logic (concrete step)
        var result = await _provider.CreatePaymentUrlAsync(request);

        // Step 5: Hook method (can be overridden)
        await AfterProcessPaymentAsync(request, result);

        return result;
    }

    // HOOK METHODS - Subclasses can override
    protected virtual Task BeforeProcessPaymentAsync(PaymentRequest request)
    {
        return Task.CompletedTask;
    }

    protected virtual string? ValidatePaymentRequest(PaymentRequest request)
    {
        if (string.IsNullOrEmpty(request.OrderId))
            return "Order ID is required";
        if (request.Amount <= 0)
            return "Amount must be positive";
        return null;
    }

    protected virtual Task AfterProcessPaymentAsync(
        PaymentRequest request,
        PaymentUrlResult result)
    {
        return Task.CompletedTask;
    }

    // ABSTRACT METHOD - Subclasses must implement
    public abstract PaymentMethod GetPaymentMethod();
}
```

**Concrete Implementation:** `OnlinePaymentProcessor.cs`

```csharp
public class OnlinePaymentProcessor : PaymentProcessor
{
    public override PaymentMethod GetPaymentMethod()
        => PaymentMethod.Online;

    protected override async Task BeforeProcessPaymentAsync(
        PaymentRequest request)
    {
        _logger.LogInformation("Starting online payment for {OrderId}",
            request.OrderId);
    }

    protected override string? ValidatePaymentRequest(PaymentRequest request)
    {
        var baseValidation = base.ValidatePaymentRequest(request);
        if (!string.IsNullOrEmpty(baseValidation))
            return baseValidation;

        // Online payment specific validation
        if (request.Amount > 500_000_000)
            return "Amount exceeds maximum limit";
        if (string.IsNullOrEmpty(request.IpAddress))
            return "IP Address is required for online payment";

        return null;
    }
}
```

#### 2.8.5. Ưu nhược điểm

**Ưu điểm:**

- ✅ **Code reuse**: Common logic ở base class
- ✅ **DRY Principle**: Không duplicate code
- ✅ **Controlled extension**: Base class kiểm soát algorithm flow
- ✅ **Easy maintenance**: Thay đổi common logic ở một nơi

**Nhược điểm:**

- ❌ Inheritance coupling (tight coupling với base class)
- ❌ Liskov Substitution violations nếu override sai
- ❌ Khó hiểu flow nếu quá nhiều hook methods

---

## CHƯƠNG 3: ỨNG DỤNG THỰC TẾ - DỰ ÁN WATCHSTORE

### 3.1. Tổng quan dự án

**Tên dự án:** Watchstore E-commerce Platform

**Mô tả:** Hệ thống thương mại điện tử chuyên bán đồng hồ cao cấp, bao gồm:

- **User Website**: Giao diện khách hàng (Browse, Cart, Checkout, Order tracking)
- **Admin Dashboard**: Quản trị hệ thống (CRUD Products, Orders, Users, Analytics)
- **Backend API**: RESTful API với authentication, payment integration

**Tech Stack:**

- **Backend**: .NET 8, ASP.NET Core Web API, Entity Framework Core 8
- **Frontend**: React 18, Vite 5, Tailwind CSS, Zustand
- **Database**: SQL Server 2022
- **Payment**: VNPay Gateway Integration
- **Architecture**: Clean Architecture (4 layers)

### 3.2. Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ User Web    │  │ Admin Web   │  │   API       │     │
│  │ (React)     │  │ (React)     │  │ Controllers │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
└─────────┼─────────────────┼─────────────────┼───────────┘
          │                 │                 │
          └─────────────────┴─────────────────┘
                            │
┌───────────────────────────┼───────────────────────────────┐
│              APPLICATION LAYER (Business Logic)           │
│  ┌──────────────────────────────────────────────────┐    │
│  │           ServiceFacade (Facade Pattern)         │    │
│  └────────┬──────────┬──────────┬──────────┬────────┘    │
│           │          │          │          │              │
│  ┌────────┴────┐ ┌──┴────┐ ┌───┴────┐ ┌──┴──────┐       │
│  │ WatchService│ │ Order │ │Payment │ │  Auth   │       │
│  │             │ │Service│ │Service │ │ Service │       │
│  └─────────────┘ └───────┘ └────────┘ └─────────┘       │
└───────────────────────────┼───────────────────────────────┘
                            │
┌───────────────────────────┼───────────────────────────────┐
│                  DOMAIN LAYER (Entities)                  │
│  ┌─────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │Watch│ │Order │ │Brand │ │User  │ │Review│ │Coupon│  │
│  └─────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │
│  Interfaces: IRepository<T>, IUnitOfWork                 │
└───────────────────────────┼───────────────────────────────┘
                            │
┌───────────────────────────┼───────────────────────────────┐
│           INFRASTRUCTURE LAYER (Data Access)              │
│  ┌─────────────────────────────────────────────────┐     │
│  │  UnitOfWork (Unit of Work Pattern)              │     │
│  │    ├─ Repository<Watch>  (Repository Pattern)   │     │
│  │    ├─ Repository<Order>                         │     │
│  │    └─ Repository<User>                          │     │
│  └────────────────────┬────────────────────────────┘     │
│                       │                                   │
│  ┌────────────────────┴────────────────────────────┐     │
│  │        WatchStoreDbContext (EF Core)            │     │
│  └────────────────────┬────────────────────────────┘     │
└───────────────────────┼───────────────────────────────────┘
                        │
                ┌───────┴────────┐
                │  SQL Server    │
                │   Database     │
                └────────────────┘
```

### 3.3. Design Patterns Map trong Watchstore

| **Pattern**         | **Location**                              | **Purpose**                        |
| ------------------- | ----------------------------------------- | ---------------------------------- |
| **Singleton**       | `LoggingService`                          | Global logging instance            |
| **Factory**         | `PaymentService.CreatePaymentProcessor()` | Create payment processors          |
| **Builder**         | `ModelBuilder` (EF Core Fluent API)       | Configure entity mappings          |
| **Facade**          | `ServiceFacade`                           | Simplify service dependencies      |
| **Repository**      | `Repository<T>`                           | Abstract data access               |
| **Unit of Work**    | `UnitOfWork`                              | Transaction management             |
| **Strategy**        | `IPaymentProvider` (VNPay, COD)           | Interchangeable payment algorithms |
| **Template Method** | `PaymentProcessor`                        | Payment processing workflow        |

### 3.4. Demo Workflow: Tạo đơn hàng với thanh toán VNPay

**Bước 1: User chọn sản phẩm và checkout**

```http
POST /api/orders
{
  "items": [
    { "watchId": 1, "quantity": 1, "price": 50000000 }
  ],
  "shippingAddress": "123 Nguyen Hue, Q1, TPHCM",
  "paymentMethod": "Online",
  "paymentProvider": "VNPay"
}
```

**Bước 2: Backend tạo order (Unit of Work Pattern)**
**Bước 3: Tạo payment URL (Strategy + Template Method)**
**Bước 4: User thanh toán → VNPay callback**
**Bước 5: Validate và update order status**

---

## BẢNG PHÂN CÔNG CÔNG VIỆC

| **STT** | **Công việc**            | **Người thực hiện**     | **Mô tả chi tiết**              |
| ------- | ------------------------ | ----------------------- | ------------------------------- |
| **1**   | **Backend Development**  | **Ngô Xuân Hải**        |                                 |
| 1.1     | Repository Pattern       | Hải                     | Implement `Repository<T>`       |
| 1.2     | Unit of Work Pattern     | Hải                     | Transaction management          |
| 1.3     | Strategy Pattern         | Hải                     | Payment strategies (VNPay, COD) |
| 1.4     | Template Method Pattern  | Hải                     | PaymentProcessor workflow       |
| 1.5     | API Development          | Hải                     | Controllers, Authentication     |
| **2**   | **Frontend Development** | **Phan Văn Hoàng Long** |                                 |
| 2.1     | Singleton Pattern        | Long                    | LoggingService                  |
| 2.2     | Factory Pattern          | Long                    | PaymentService factory          |
| 2.3     | Builder Pattern          | Long                    | Entity configuration            |
| 2.4     | Facade Pattern           | Long                    | ServiceFacade                   |
| 2.5     | UI/UX Design             | Long                    | User Website + Admin            |
| 2.6     | API Integration          | Long                    | Axios, state management         |

---

## KẾT LUẬN

### 6.1. Tóm tắt

Qua quá trình nghiên cứu và triển khai dự án Watchstore E-commerce, nhóm đã thành công:

1. **Nghiên cứu lý thuyết:** Hiểu sâu về 8 Design Patterns
2. **Áp dụng thực tế:** Triển khai trong hệ thống thực tế
3. **Clean Architecture:** Xây dựng hệ thống 4 layers
4. **Tech Stack hiện đại:** .NET 8, React 18, SQL Server

**Các patterns đã implement:**

- ✅ Singleton, Factory, Builder, Facade
- ✅ Repository, Unit of Work
- ✅ Strategy, Template Method

### 6.2. Nhận xét, đánh giá

**Ưu điểm:**

- Code có cấu trúc rõ ràng, dễ maintain
- Tuân thủ SOLID principles
- Dễ mở rộng features mới
- Testability cao

**Khó khăn:**

- Learning curve cao
- Cần cân nhắc khi áp dụng patterns

**Bài học:**

- Design patterns không phải silver bullet
- Clean Architecture giúp code dễ maintain
- Testing và documentation quan trọng

### 6.3. Hướng phát triển

**Tính năng mở rộng:**

- Thêm payment providers: Momo, ZaloPay
- Caching với Redis
- Notification system
- Mobile app

**Technical improvements:**

- CQRS pattern
- Microservices architecture
- Real-time features với SignalR

---

## TÀI LIỆU THAM KHẢO

**Sách:**

1. Gamma, E., et al. (1994). _Design Patterns: Elements of Reusable Object-Oriented Software_. Addison-Wesley.
2. Martin, R. C. (2017). _Clean Architecture_. Prentice Hall.
3. Fowler, M. (2002). _Patterns of Enterprise Application Architecture_. Addison-Wesley.

**Websites:**

1. Refactoring.Guru: https://refactoring.guru/design-patterns
2. SourceMaking.com: https://sourcemaking.com/design_patterns
3. Microsoft Docs: https://docs.microsoft.com/en-us/dotnet/architecture/

**Tài liệu môn học:**

1. Slide bài giảng Design Patterns - HUFLIT
2. Bài tập thực hành môn học

---

**HẾT**

---

**Ghi chú format Word:**

- Font: Times New Roman 13pt
- Căn lề: Trái 3cm, Phải 2cm, Trên/Dưới 2.5cm
- Giãn dòng: 1.5 lines
- Code: Courier New, nền xám
