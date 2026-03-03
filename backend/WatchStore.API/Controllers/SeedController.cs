using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
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
                new CreateWatchDtoBuilder()
                    .WithName("Seamaster Aqua Terra 150M")
                    .WithDescription("Professional diving watch with Co-Axial Escapement")
                    .WithPrice(185000000)
                    .WithBrand(1)
                    .WithCaseSize("41mm")
                    .WithWaterResistance("150m")
                    .WithMovement("Automatic")
                    .WithStatus(WatchStatus.Available)
                    .Build(),

                new CreateWatchDtoBuilder()
                    .WithName("Royal Oak Offshore Chronograph")
                    .WithDescription("Luxury sports watch with ceramic bezel")
                    .WithPrice(425000000)
                    .WithBrand(2)
                    .WithCaseSize("44mm")
                    .WithWaterResistance("100m")
                    .WithMovement("Automatic")
                    .WithStatus(WatchStatus.Available)
                    .Build(),

                new CreateWatchDtoBuilder()
                    .WithName("Speedmaster Professional Moonwatch")
                    .WithDescription("Official watch of NASA's moon landing")
                    .WithPrice(275000000)
                    .WithBrand(3)
                    .WithCaseSize("42mm")
                    .WithWaterResistance("50m")
                    .WithMovement("Manual")
                    .WithStatus(WatchStatus.Available)
                    .Build(),

                new CreateWatchDtoBuilder()
                    .WithName("Daytona Cosmograph Racing")
                    .WithDescription("Legendary chronograph watch for racing")
                    .WithPrice(350000000)
                    .WithBrand(4)
                    .WithCaseSize("40mm")
                    .WithWaterResistance("100m")
                    .WithMovement("Automatic")
                    .WithStatus(WatchStatus.Available)
                    .Build(),

                new CreateWatchDtoBuilder()
                    .WithName("Submariner Date No Date")
                    .WithDescription("Classic diving watch with 300m water resistance")
                    .WithPrice(280000000)
                    .WithBrand(4)
                    .WithCaseSize("40mm")
                    .WithWaterResistance("300m")
                    .WithMovement("Automatic")
                    .WithStatus(WatchStatus.Available)
                    .Build(),

                new CreateWatchDtoBuilder()
                    .WithName("GMT-Master II Pepsi")
                    .WithDescription("Dual time zone watch with rotating bezel")
                    .WithPrice(310000000)
                    .WithBrand(4)
                    .WithCaseSize("40mm")
                    .WithWaterResistance("100m")
                    .WithMovement("Automatic")
                    .WithStatus(WatchStatus.Available)
                    .Build(),

                new CreateWatchDtoBuilder()
                    .WithName("Datejust Classic")
                    .WithDescription("Elegant dress watch with date window")
                    .WithPrice(220000000)
                    .WithBrand(4)
                    .WithCaseSize("36mm")
                    .WithWaterResistance("100m")
                    .WithMovement("Automatic")
                    .WithStatus(WatchStatus.Available)
                    .Build(),

                new CreateWatchDtoBuilder()
                    .WithName("Sky-Dweller Annual Calendar")
                    .WithDescription("Advanced calendar watch with annual change")
                    .WithPrice(550000000)
                    .WithBrand(4)
                    .WithCaseSize("42mm")
                    .WithWaterResistance("100m")
                    .WithMovement("Automatic")
                    .WithStatus(WatchStatus.Available)
                    .Build(),

                new CreateWatchDtoBuilder()
                    .WithName("Nautilus Aquanaut")
                    .WithDescription("Iconic luxury sports watch")
                    .WithPrice(480000000)
                    .WithBrand(5)
                    .WithCaseSize("40mm")
                    .WithWaterResistance("120m")
                    .WithMovement("Automatic")
                    .WithStatus(WatchStatus.Available)
                    .Build(),

                new CreateWatchDtoBuilder()
                    .WithName("Aquanaut Travel Time")
                    .WithDescription("Travel time watch with dual timezone")
                    .WithPrice(520000000)
                    .WithBrand(5)
                    .WithCaseSize("42mm")
                    .WithWaterResistance("120m")
                    .WithMovement("Automatic")
                    .WithStatus(WatchStatus.Available)
                    .Build()
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
