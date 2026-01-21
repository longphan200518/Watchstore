using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WatchStore.Application.Features.Auth;
using WatchStore.Application.Features.Users;
using WatchStore.Application.Features.Watches;
using WatchStore.Application.Features.Brands;
using WatchStore.Application.Features.Orders;
using WatchStore.Application.Features.Reviews;
using WatchStore.Application.Features.Dashboard;
using WatchStore.Application.Features.WebsiteSettings;
using Microsoft.OpenApi.Models;
using WatchStore.Application.Interfaces;
using WatchStore.Application.Services;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;
using WatchStore.Infrastructure.Data;
using WatchStore.Infrastructure.Repositories;
using WatchStore.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("user", new OpenApiInfo
    {
        Title = "Watch Store - User API",
        Version = "v1",
        Description = "Public/User endpoints"
    });

    c.SwaggerDoc("admin", new OpenApiInfo
    {
        Title = "Watch Store - Admin API",
        Version = "v1",
        Description = "Admin/Backoffice endpoints"
    });

    // Filter by ApiExplorer GroupName
    c.DocInclusionPredicate((docName, apiDesc) =>
    {
        var groupName = apiDesc.GroupName ?? "user";
        return string.Equals(groupName, docName, StringComparison.OrdinalIgnoreCase);
    });
});

// Database
builder.Services.AddDbContext<WatchStoreDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<User, Role>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
.AddEntityFrameworkStores<WatchStoreDbContext>()
.AddDefaultTokenProviders();

// JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = Encoding.UTF8.GetBytes(jwtSettings["Secret"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(secretKey)
    };
});

// Memory Cache
builder.Services.AddMemoryCache();

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<WatchStore.Application.DTOs.CreateWatchDto>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(
            "http://localhost:6868",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:3001"
        )
        .AllowAnyMethod()
        .AllowAnyHeader());
});

// Services
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<VNPayService>();
builder.Services.AddScoped<IWatchService, WatchService>();
builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IWebsiteSettingsService, WebsiteSettingsService>();
builder.Services.AddScoped<ICouponService, CouponService>();

// Image Upload Service (use Cloudinary or Local based on configuration)
// TODO: Uncomment after installing CloudinaryDotNet package
// var useCloudinary = builder.Configuration.GetValue<bool>("ImageUpload:UseCloudinary");
// if (useCloudinary)
// {
//     builder.Services.AddScoped<IImageUploadService, CloudinaryImageUploadService>();
// }
// else
// {
//     builder.Services.AddScoped<IImageUploadService, LocalImageUploadService>();
// }

var app = builder.Build();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<WatchStoreDbContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();

    await DatabaseSeeder.SeedAsync(context, userManager, roleManager);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/user/swagger.json", "User API");
        options.SwaggerEndpoint("/swagger/admin/swagger.json", "Admin API");
        options.DefaultModelsExpandDepth(-1);
    });
}

// Avoid https redirect during local dev to prevent CORS preflight redirects
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
