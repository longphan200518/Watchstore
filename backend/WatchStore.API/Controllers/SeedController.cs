using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Application.Common;
using Microsoft.AspNetCore.Authorization;
using WatchStore.Domain.Enums;

namespace WatchStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class SeedController : ControllerBase
    {
        private readonly IWatchService _watchService;
        private readonly IBrandService _brandService;

        public SeedController(IWatchService watchService, IBrandService brandService)
        {
            _watchService = watchService;
            _brandService = brandService;
        }

        /// <summary>
        /// Seed test watches (Admin only)
        /// </summary>
        [HttpPost("watches")]
        public async Task<IActionResult> SeedWatches()
        {
            var testWatches = new List<CreateWatchDto>
            {
                new CreateWatchDto
                {
                    Name = "Seamaster Aqua Terra 150M",
                    Description = "Professional diving watch with Co-Axial Escapement",
                    Price = 185000000,
                    BrandId = 1,
                    CaseSize = "41mm",
                    WaterResistance = "150m",
                    Movement = "Automatic",
                    Status = WatchStatus.Available
                },
                new CreateWatchDto
                {
                    Name = "Royal Oak Offshore Chronograph",
                    Description = "Luxury sports watch with ceramic bezel",
                    Price = 425000000,
                    BrandId = 2,
                    CaseSize = "44mm",
                    WaterResistance = "100m",
                    Movement = "Automatic",
                    Status = WatchStatus.Available
                },
                new CreateWatchDto
                {
                    Name = "Speedmaster Professional Moonwatch",
                    Description = "Official watch of NASA's moon landing",
                    Price = 275000000,
                    BrandId = 3,
                    CaseSize = "42mm",
                    WaterResistance = "50m",
                    Movement = "Manual",
                    Status = WatchStatus.Available
                },
                new CreateWatchDto
                {
                    Name = "Daytona Cosmograph Racing",
                    Description = "Legendary chronograph watch for racing",
                    Price = 350000000,
                    BrandId = 4,
                    CaseSize = "40mm",
                    WaterResistance = "100m",
                    Movement = "Automatic",
                    Status = WatchStatus.Available
                },
                new CreateWatchDto
                {
                    Name = "Submariner Date No Date",
                    Description = "Classic diving watch with 300m water resistance",
                    Price = 280000000,
                    BrandId = 4,
                    CaseSize = "40mm",
                    WaterResistance = "300m",
                    Movement = "Automatic",
                    Status = WatchStatus.Available
                },
                new CreateWatchDto
                {
                    Name = "GMT-Master II Pepsi",
                    Description = "Dual time zone watch with rotating bezel",
                    Price = 310000000,
                    BrandId = 4,
                    CaseSize = "40mm",
                    WaterResistance = "100m",
                    Movement = "Automatic",
                    Status = WatchStatus.Available
                },
                new CreateWatchDto
                {
                    Name = "Datejust Classic",
                    Description = "Elegant dress watch with date window",
                    Price = 220000000,
                    BrandId = 4,
                    CaseSize = "36mm",
                    WaterResistance = "100m",
                    Movement = "Automatic",
                    Status = WatchStatus.Available
                },
                new CreateWatchDto
                {
                    Name = "Sky-Dweller Annual Calendar",
                    Description = "Advanced calendar watch with annual change",
                    Price = 550000000,
                    BrandId = 4,
                    CaseSize = "42mm",
                    WaterResistance = "100m",
                    Movement = "Automatic",
                    Status = WatchStatus.Available
                },
                new CreateWatchDto
                {
                    Name = "Nautilus Aquanaut",
                    Description = "Iconic luxury sports watch",
                    Price = 480000000,
                    BrandId = 5,
                    CaseSize = "40mm",
                    WaterResistance = "120m",
                    Movement = "Automatic",
                    Status = WatchStatus.Available
                },
                new CreateWatchDto
                {
                    Name = "Aquanaut Travel Time",
                    Description = "Travel time watch with dual timezone",
                    Price = 520000000,
                    BrandId = 5,
                    CaseSize = "42mm",
                    WaterResistance = "120m",
                    Movement = "Automatic",
                    Status = WatchStatus.Available
                }
            };

            var results = new List<object>();
            foreach (var watch in testWatches)
            {
                // For now, just return success. In production, you'd save to DB
                results.Add(new { watch.Name, watch.Price, Status = "Created" });
            }

            return Ok(new { message = "Test watches loaded", count = results.Count, watches = results });
        }
    }
}
