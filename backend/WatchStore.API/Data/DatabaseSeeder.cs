using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Enums;
using WatchStore.Infrastructure.Data;

namespace WatchStore.API.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(
            WatchStoreDbContext context,
            UserManager<User> userManager,
            RoleManager<Role> roleManager)
        {
            await context.Database.MigrateAsync();

            // Seed Roles
            await SeedRoles(roleManager);

            // Seed Admin User
            await SeedAdminUser(userManager);

            // Seed Brands
            if (!context.Brands.Any())
            {
                await SeedBrands(context);
            }

            // Seed Watches
            if (!context.Watches.Any())
            {
                await SeedWatches(context);
            }

            // Seed Website Settings
            if (!context.WebsiteSettings.Any())
            {
                await SeedWebsiteSettings(context);
            }

            await context.SaveChangesAsync();
        }

        private static async Task SeedRoles(RoleManager<Role> roleManager)
        {
            string[] roles = { "Admin", "User" };

            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new Role { Name = roleName });
                }
            }
        }

        private static async Task SeedAdminUser(UserManager<User> userManager)
        {
            var adminEmail = "admin@gmail.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new User
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "Administrator",
                    EmailConfirmed = true,
                    PhoneNumber = "0123456789"
                };

                var result = await userManager.CreateAsync(adminUser, "admin123@");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }

        private static async Task SeedBrands(WatchStoreDbContext context)
        {
            var brands = new List<Brand>
            {
                new Brand { Name = "Rolex", Description = "Swiss luxury watch manufacturer known for precision and prestige", LogoUrl = "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Rolex_logo.svg/200px-Rolex_logo.svg.png", Country = "Switzerland" },
                new Brand { Name = "Omega", Description = "Swiss watchmaker famous for Speedmaster and Seamaster collections", LogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Omega_Logo.svg/200px-Omega_Logo.svg.png", Country = "Switzerland" },
                new Brand { Name = "Seiko", Description = "Japanese watchmaker renowned for innovation and quality", LogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Seiko_logo.svg/200px-Seiko_logo.svg.png", Country = "Japan" },
                new Brand { Name = "Casio", Description = "Japanese electronics company famous for G-Shock watches", LogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Casio_logo.svg/200px-Casio_logo.svg.png", Country = "Japan" },
                new Brand { Name = "Citizen", Description = "Japanese watchmaker known for Eco-Drive technology", LogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Citizen_Watch_Company_of_America%2C_Inc._logo.svg/200px-Citizen_Watch_Company_of_America%2C_Inc._logo.svg.png", Country = "Japan" },
                new Brand { Name = "Orient", Description = "Japanese watch brand offering mechanical watches at accessible prices", LogoUrl = "https://www.orientwatch.com/images/orient-logo.png", Country = "Japan" }
            };

            await context.Brands.AddRangeAsync(brands);
            await context.SaveChangesAsync();
        }

        private static async Task SeedWatches(WatchStoreDbContext context)
        {
            var brands = await context.Brands.ToListAsync();
            var rolex = brands.First(b => b.Name == "Rolex");
            var omega = brands.First(b => b.Name == "Omega");
            var seiko = brands.First(b => b.Name == "Seiko");
            var casio = brands.First(b => b.Name == "Casio");
            var citizen = brands.First(b => b.Name == "Citizen");
            var orient = brands.First(b => b.Name == "Orient");

            var watches = new List<Watch>
            {
                // Rolex Watches (5 models)
                new Watch
                {
                    Name = "Rolex Submariner Date",
                    Description = "Iconic diving watch with date function, water-resistant to 300m",
                    Price = 285000000,
                    StockQuantity = 5,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id,
                    CaseSize = "41mm",
                    Movement = "Automatic Caliber 3235",
                    Functions = "Date, Unidirectional Rotatable Bezel",
                    Thickness = "12.5mm",
                    BandWidth = "20mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Oystersteel",
                    BandMaterial = "Oystersteel Bracelet",
                    WaterResistance = "300m",
                    Warranty = "5 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Rolex Datejust 36",
                    Description = "Classic dress watch with date display and cyclops lens",
                    Price = 245000000,
                    StockQuantity = 8,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id,
                    CaseSize = "36mm",
                    Movement = "Automatic Caliber 3235",
                    Functions = "Date, Hour, Minute, Second",
                    Thickness = "11.5mm",
                    BandWidth = "20mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Oystersteel",
                    BandMaterial = "Jubilee Bracelet",
                    WaterResistance = "100m",
                    Warranty = "5 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://content.rolex.com/dam/2024/upright-bba-with-shadow/m126234-0051.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Rolex GMT-Master II",
                    Description = "Dual time zone watch for travelers with 24-hour hand",
                    Price = 295000000,
                    StockQuantity = 3,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id,
                    CaseSize = "40mm",
                    Movement = "Automatic Caliber 3285",
                    Functions = "GMT, Date, Hour, Minute, Second",
                    Thickness = "12mm",
                    BandWidth = "20mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Oystersteel",
                    BandMaterial = "Oyster Bracelet",
                    WaterResistance = "100m",
                    Warranty = "5 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://content.rolex.com/dam/2024/upright-bba-with-shadow/m126710blro-0003.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Rolex Day-Date 40",
                    Description = "Prestigious watch displaying day and date, President bracelet",
                    Price = 850000000,
                    StockQuantity = 2,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id,
                    CaseSize = "40mm",
                    Movement = "Automatic Caliber 3255",
                    Functions = "Day, Date, Hour, Minute, Second",
                    Thickness = "12mm",
                    BandWidth = "20mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "18k Yellow Gold",
                    BandMaterial = "President Bracelet",
                    WaterResistance = "100m",
                    Warranty = "5 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://content.rolex.com/dam/2024/upright-bba-with-shadow/m228238-0042.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Rolex Oyster Perpetual 41",
                    Description = "Entry-level Rolex with vibrant dial colors, time-only",
                    Price = 195000000,
                    StockQuantity = 10,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id,
                    CaseSize = "41mm",
                    Movement = "Automatic Caliber 3230",
                    Functions = "Hour, Minute, Second",
                    Thickness = "11.5mm",
                    BandWidth = "20mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Oystersteel",
                    BandMaterial = "Oyster Bracelet",
                    WaterResistance = "100m",
                    Warranty = "5 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://content.rolex.com/dam/2024/upright-bba-with-shadow/m124300-0005.png", IsPrimary = true }
                    }
                },

                // Omega Watches (5 models)
                new Watch
                {
                    Name = "Omega Speedmaster Professional Moonwatch",
                    Description = "Legendary chronograph worn on the moon, manual-wind",
                    Price = 155000000,
                    StockQuantity = 12,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id,
                    CaseSize = "42mm",
                    Movement = "Manual Caliber 1861",
                    Functions = "Chronograph, Tachymeter, Hour, Minute, Second",
                    Thickness = "13.2mm",
                    BandWidth = "20mm",
                    Crystal = "Hesalite Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "50m",
                    Warranty = "5 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.omegawatches.com/media/catalog/product/cache/a5c37fddc1a529a1a44fea55d527b9a116f3738da3a2cc38006fcc613c37c391/o/m/omega-speedmaster-moonwatch-professional-co-axial-master-chronometer-chronograph-42-mm-31030425001002-l.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Omega Seamaster Diver 300M",
                    Description = "Professional diving watch with Co-Axial movement",
                    Price = 135000000,
                    StockQuantity = 15,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id,
                    CaseSize = "42mm",
                    Movement = "Automatic Co-Axial 8800",
                    Functions = "Date, Hour, Minute, Second, Helium Escape Valve",
                    Thickness = "13.5mm",
                    BandWidth = "20mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "300m",
                    Warranty = "5 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.omegawatches.com/media/catalog/product/cache/a5c37fddc1a529a1a44fea55d527b9a116f3738da3a2cc38006fcc613c37c391/o/m/omega-seamaster-diver-300m-co-axial-master-chronometer-42-mm-21030422003001-l.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Omega Constellation Co-Axial",
                    Description = "Elegant dress watch with iconic 'claws' design",
                    Price = 125000000,
                    StockQuantity = 8,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id,
                    CaseSize = "39mm",
                    Movement = "Automatic Co-Axial 8900",
                    Functions = "Date, Hour, Minute, Second",
                    Thickness = "12.1mm",
                    BandWidth = "19mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "100m",
                    Warranty = "5 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.omegawatches.com/media/catalog/product/cache/a5c37fddc1a529a1a44fea55d527b9a116f3738da3a2cc38006fcc613c37c391/o/m/omega-constellation-co-axial-master-chronometer-39-mm-13110392103001-l.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Omega De Ville Prestige",
                    Description = "Classic dress watch with slim profile and elegant design",
                    Price = 95000000,
                    StockQuantity = 10,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id,
                    CaseSize = "39.5mm",
                    Movement = "Automatic Co-Axial 2500",
                    Functions = "Date, Hour, Minute, Second",
                    Thickness = "9.5mm",
                    BandWidth = "19mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Leather Strap",
                    WaterResistance = "30m",
                    Warranty = "3 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.omegawatches.com/media/catalog/product/cache/a5c37fddc1a529a1a44fea55d527b9a116f3738da3a2cc38006fcc613c37c391/o/m/omega-de-ville-prestige-co-axial-39-5-mm-42413402001001-l.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Omega Aqua Terra 150M",
                    Description = "Versatile sports-elegant watch with teak dial pattern",
                    Price = 145000000,
                    StockQuantity = 7,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id,
                    CaseSize = "41mm",
                    Movement = "Automatic Co-Axial 8900",
                    Functions = "Date, Hour, Minute, Second",
                    Thickness = "12.5mm",
                    BandWidth = "20mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "150m",
                    Warranty = "5 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.omegawatches.com/media/catalog/product/cache/a5c37fddc1a529a1a44fea55d527b9a116f3738da3a2cc38006fcc613c37c391/o/m/omega-seamaster-aqua-terra-150m-co-axial-master-chronometer-41-mm-22010412103001-l.png", IsPrimary = true }
                    }
                },

                // Seiko Watches (5 models)
                new Watch
                {
                    Name = "Seiko Prospex Diver's 200m Automatic",
                    Description = "Professional diving watch inspired by 1965 classic",
                    Price = 12500000,
                    StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id,
                    CaseSize = "42.6mm",
                    Movement = "Automatic Caliber 6R35",
                    Functions = "Date, Unidirectional Bezel, Hour, Minute, Second",
                    Thickness = "13.2mm",
                    BandWidth = "22mm",
                    Crystal = "Hardlex Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "200m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://seikousa.com/cdn/shop/files/SPB143_3.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Seiko Presage Cocktail Time",
                    Description = "Dress watch with stunning sunburst dial and cocktail-inspired design",
                    Price = 8900000,
                    StockQuantity = 25,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id,
                    CaseSize = "40.5mm",
                    Movement = "Automatic Caliber 4R35",
                    Functions = "Date, Hour, Minute, Second",
                    Thickness = "11.8mm",
                    BandWidth = "20mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Leather Strap",
                    WaterResistance = "50m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://seikousa.com/cdn/shop/files/SRPB43_3.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Seiko 5 Sports Automatic",
                    Description = "Affordable automatic watch with great build quality",
                    Price = 5500000,
                    StockQuantity = 35,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id,
                    CaseSize = "42.5mm",
                    Movement = "Automatic Caliber 4R36",
                    Functions = "Date, Day, Hour, Minute, Second",
                    Thickness = "13.4mm",
                    BandWidth = "22mm",
                    Crystal = "Hardlex Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "100m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://seikousa.com/cdn/shop/files/SRPD51_3.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Seiko Astron GPS Solar",
                    Description = "Solar-powered GPS watch with dual-time display",
                    Price = 28000000,
                    StockQuantity = 8,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id,
                    CaseSize = "42.7mm",
                    Movement = "GPS Solar Caliber 5X53",
                    Functions = "GPS Time Sync, Dual Time, Perpetual Calendar",
                    Thickness = "12.2mm",
                    BandWidth = "22mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Titanium",
                    BandMaterial = "Titanium Bracelet",
                    WaterResistance = "100m",
                    Warranty = "3 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://seikousa.com/cdn/shop/files/SSH001_3.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Seiko King Turtle Automatic Diver",
                    Description = "Robust diving watch with cushion-shaped case",
                    Price = 15000000,
                    StockQuantity = 15,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id,
                    CaseSize = "45mm",
                    Movement = "Automatic Caliber 4R36",
                    Functions = "Date, Day, Unidirectional Bezel",
                    Thickness = "13mm",
                    BandWidth = "22mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Silicone Strap",
                    WaterResistance = "200m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://seikousa.com/cdn/shop/files/SRPE05_3.jpg", IsPrimary = true }
                    }
                },

                // Casio Watches (5 models)
                new Watch
                {
                    Name = "Casio G-Shock GA-2100 CasiOak",
                    Description = "Slim octagonal G-Shock with Carbon Core Guard structure",
                    Price = 3200000,
                    StockQuantity = 40,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id,
                    CaseSize = "45.4mm",
                    Movement = "Quartz Digital-Analog",
                    Functions = "World Time, Stopwatch, LED Light, Shock Resistant",
                    Thickness = "11.8mm",
                    BandWidth = "25mm",
                    Crystal = "Mineral Crystal",
                    CaseMaterial = "Carbon & Resin",
                    BandMaterial = "Resin Band",
                    WaterResistance = "200m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/GA/GA2/GA-2100-1A1/assets/GA-2100-1A1.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Casio G-Shock DW-5600E Classic Square",
                    Description = "Iconic square G-Shock, the original shock-resistant watch",
                    Price = 2500000,
                    StockQuantity = 50,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id,
                    CaseSize = "42.8mm",
                    Movement = "Quartz Digital",
                    Functions = "Stopwatch, Timer, Alarm, EL Backlight",
                    Thickness = "13.4mm",
                    BandWidth = "18mm",
                    Crystal = "Mineral Crystal",
                    CaseMaterial = "Resin",
                    BandMaterial = "Resin Band",
                    WaterResistance = "200m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/DW/DW5/DW-5600E-1V/assets/DW-5600E-1V.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Casio Edifice EQB-1000",
                    Description = "Solar-powered chronograph with Bluetooth connectivity",
                    Price = 8500000,
                    StockQuantity = 18,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id,
                    CaseSize = "47mm",
                    Movement = "Tough Solar Quartz",
                    Functions = "Bluetooth, Chronograph, World Time, Solar Power",
                    Thickness = "12.8mm",
                    BandWidth = "22mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "100m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/E/EQ/EQB/EQB-1000D-1A/assets/EQB-1000D-1A.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Casio Pro Trek PRW-6900",
                    Description = "Multi-sensor outdoor watch with compass, altimeter, barometer",
                    Price = 7200000,
                    StockQuantity = 12,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id,
                    CaseSize = "56.3mm",
                    Movement = "Tough Solar Quartz",
                    Functions = "Compass, Altimeter, Barometer, Thermometer, Solar",
                    Thickness = "14.3mm",
                    BandWidth = "25mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Resin & Stainless Steel",
                    BandMaterial = "Resin Band",
                    WaterResistance = "200m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/P/PR/PRW/PRW-6900Y-1/assets/PRW-6900Y-1.png", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Casio Vintage A168WA Digital",
                    Description = "Retro digital watch with iconic 80s design",
                    Price = 1200000,
                    StockQuantity = 60,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id,
                    CaseSize = "36.8mm",
                    Movement = "Quartz Digital",
                    Functions = "Alarm, Stopwatch, LED Light, Calendar",
                    Thickness = "9.6mm",
                    BandWidth = "18mm",
                    Crystal = "Acrylic Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "30m",
                    Warranty = "1 Year International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/A/A1/A16/A168WA-1/assets/A168WA-1.png", IsPrimary = true }
                    }
                },

                // Citizen Watches (5 models)
                new Watch
                {
                    Name = "Citizen Promaster Diver Eco-Drive",
                    Description = "Solar-powered diving watch with 200m water resistance",
                    Price = 9800000,
                    StockQuantity = 22,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id,
                    CaseSize = "44mm",
                    Movement = "Eco-Drive Solar Quartz",
                    Functions = "Date, Solar Power, Unidirectional Bezel",
                    Thickness = "12mm",
                    BandWidth = "22mm",
                    Crystal = "Mineral Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Polyurethane Strap",
                    WaterResistance = "200m",
                    Warranty = "5 Years Eco-Drive Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.citizenwatch.com/dw/image/v2/BFNH_PRD/on/demandware.static/-/Sites-ctznUS-Library/default/dw26a09f21/images/products/BN0150-28E_angle.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Citizen Eco-Drive Perpetual Calendar",
                    Description = "Solar watch with perpetual calendar, never needs battery",
                    Price = 12000000,
                    StockQuantity = 15,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id,
                    CaseSize = "42mm",
                    Movement = "Eco-Drive Caliber H500",
                    Functions = "Perpetual Calendar, Date, Day, Month",
                    Thickness = "11.5mm",
                    BandWidth = "22mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "100m",
                    Warranty = "5 Years Eco-Drive Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.citizenwatch.com/dw/image/v2/BFNH_PRD/on/demandware.static/-/Sites-ctznUS-Library/default/dw8e4f2c91/images/products/BL8144-54H_angle.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Citizen Satellite Wave GPS",
                    Description = "GPS timekeeping watch syncing with atomic clocks worldwide",
                    Price = 18500000,
                    StockQuantity = 10,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id,
                    CaseSize = "44mm",
                    Movement = "Eco-Drive Satellite Wave GPS",
                    Functions = "GPS Time Sync, Dual Time, Perpetual Calendar",
                    Thickness = "13.1mm",
                    BandWidth = "23mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Titanium",
                    BandMaterial = "Titanium Bracelet",
                    WaterResistance = "100m",
                    Warranty = "5 Years Eco-Drive Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.citizenwatch.com/dw/image/v2/BFNH_PRD/on/demandware.static/-/Sites-ctznUS-Library/default/dw1c8f7e5e/images/products/CC3035-50E_angle.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Citizen Chandler Field Watch",
                    Description = "Military-inspired field watch with Eco-Drive technology",
                    Price = 4500000,
                    StockQuantity = 30,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id,
                    CaseSize = "42mm",
                    Movement = "Eco-Drive Solar Quartz",
                    Functions = "Date, Hour, Minute, Second",
                    Thickness = "11mm",
                    BandWidth = "22mm",
                    Crystal = "Mineral Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Canvas Strap",
                    WaterResistance = "100m",
                    Warranty = "5 Years Eco-Drive Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.citizenwatch.com/dw/image/v2/BFNH_PRD/on/demandware.static/-/Sites-ctznUS-Library/default/dw9f7c8b5d/images/products/BM8180-03E_angle.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Citizen Corso Dress Watch",
                    Description = "Slim elegant dress watch perfect for formal occasions",
                    Price = 6800000,
                    StockQuantity = 18,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id,
                    CaseSize = "40mm",
                    Movement = "Eco-Drive Solar Quartz",
                    Functions = "Date, Hour, Minute, Second",
                    Thickness = "8.5mm",
                    BandWidth = "20mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Leather Strap",
                    WaterResistance = "50m",
                    Warranty = "5 Years Eco-Drive Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://www.citizenwatch.com/dw/image/v2/BFNH_PRD/on/demandware.static/-/Sites-ctznUS-Library/default/dw4e5f6a7b/images/products/BM7100-59E_angle.jpg", IsPrimary = true }
                    }
                },

                // Orient Watches (5 models)
                new Watch
                {
                    Name = "Orient Bambino Gen 2 Version 2",
                    Description = "Classic dress watch with domed crystal and elegant design",
                    Price = 4200000,
                    StockQuantity = 25,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id,
                    CaseSize = "40.5mm",
                    Movement = "Automatic Caliber F6724",
                    Functions = "Hour, Minute, Second",
                    Thickness = "11.8mm",
                    BandWidth = "21mm",
                    Crystal = "Mineral Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Leather Strap",
                    WaterResistance = "30m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://orientwatch.com/cdn/shop/products/FAC00009N0_1.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Orient Kamasu Automatic Diver",
                    Description = "Affordable automatic diver with sapphire crystal",
                    Price = 6500000,
                    StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id,
                    CaseSize = "41.8mm",
                    Movement = "Automatic Caliber F6922",
                    Functions = "Date, Day, Unidirectional Bezel",
                    Thickness = "12.8mm",
                    BandWidth = "22mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "200m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://orientwatch.com/cdn/shop/products/RA-AA0004E19B_1.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Orient Ray II Automatic Diver",
                    Description = "Popular automatic diver inspired by vintage diving watches",
                    Price = 5800000,
                    StockQuantity = 28,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id,
                    CaseSize = "41.5mm",
                    Movement = "Automatic Caliber F6922",
                    Functions = "Date, Day, Unidirectional Bezel",
                    Thickness = "13mm",
                    BandWidth = "22mm",
                    Crystal = "Mineral Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "200m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://orientwatch.com/cdn/shop/products/FAA02004D9_1.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Orient Sun and Moon Open Heart",
                    Description = "Elegant automatic with sun/moon indicator and open heart",
                    Price = 9500000,
                    StockQuantity = 12,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id,
                    CaseSize = "42mm",
                    Movement = "Automatic Caliber F6B24",
                    Functions = "Date, Sun/Moon Indicator, Open Heart",
                    Thickness = "13.2mm",
                    BandWidth = "22mm",
                    Crystal = "Sapphire Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Leather Strap",
                    WaterResistance = "50m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://orientwatch.com/cdn/shop/products/RA-AS0003S10B_1.jpg", IsPrimary = true }
                    }
                },
                new Watch
                {
                    Name = "Orient Tristar Automatic",
                    Description = "Classic three-star automatic with day-date display",
                    Price = 3500000,
                    StockQuantity = 35,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id,
                    CaseSize = "39mm",
                    Movement = "Automatic Caliber 46943",
                    Functions = "Date, Day, Hour, Minute, Second",
                    Thickness = "11.5mm",
                    BandWidth = "19mm",
                    Crystal = "Mineral Crystal",
                    CaseMaterial = "Stainless Steel",
                    BandMaterial = "Stainless Steel Bracelet",
                    WaterResistance = "50m",
                    Warranty = "2 Years International Warranty",
                    Images = new List<WatchImage>
                    {
                        new WatchImage { ImageUrl = "https://orientwatch.com/cdn/shop/products/FAB00005D9_1.jpg", IsPrimary = true }
                    }
                }
            };

            await context.Watches.AddRangeAsync(watches);
            await context.SaveChangesAsync();
        }

        private static async Task SeedWebsiteSettings(WatchStoreDbContext context)
        {
            var settings = new List<WebsiteSettings>
      {
        // General Settings
        new WebsiteSettings
        {
          Key = "site_name",
          Value = "Watch Store",
          Description = "Tên website",
          Category = "General",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "site_tagline",
          Value = "Your Premium Watch Destination",
          Description = "Tagline/slogan của website",
          Category = "General",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "site_description",
          Value = "Discover luxury and style with our curated collection of premium watches",
          Description = "Mô tả website",
          Category = "General",
          DataType = "textarea"
        },
        new WebsiteSettings
        {
          Key = "contact_email",
          Value = "contact@watchstore.com",
          Description = "Email liên hệ",
          Category = "General",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "contact_phone",
          Value = "+84 123 456 789",
          Description = "Số điện thoại liên hệ",
          Category = "General",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "contact_address",
          Value = "123 Watch Street, Hanoi, Vietnam",
          Description = "Địa chỉ liên hệ",
          Category = "General",
          DataType = "textarea"
        },

        // Branding
        new WebsiteSettings
        {
          Key = "logo_url",
          Value = "https://via.placeholder.com/200x60?text=Watch+Store",
          Description = "URL của logo",
          Category = "Branding",
          DataType = "image"
        },
        new WebsiteSettings
        {
          Key = "favicon_url",
          Value = "https://via.placeholder.com/32x32?text=WS",
          Description = "URL của favicon",
          Category = "Branding",
          DataType = "image"
        },
        new WebsiteSettings
        {
          Key = "primary_color",
          Value = "#3B82F6",
          Description = "Màu chủ đạo của website",
          Category = "Branding",
          DataType = "color"
        },
        new WebsiteSettings
        {
          Key = "secondary_color",
          Value = "#10B981",
          Description = "Màu phụ của website",
          Category = "Branding",
          DataType = "color"
        },

        // Homepage
        new WebsiteSettings
        {
          Key = "hero_title",
          Value = "Discover Timeless Elegance",
          Description = "Tiêu đề hero section",
          Category = "Homepage",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "hero_subtitle",
          Value = "Explore our collection of premium watches from world-renowned brands",
          Description = "Phụ đề hero section",
          Category = "Homepage",
          DataType = "textarea"
        },
        new WebsiteSettings
        {
          Key = "hero_image",
          Value = "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          Description = "Ảnh nền hero section",
          Category = "Homepage",
          DataType = "image"
        },
        new WebsiteSettings
        {
          Key = "hero_cta_text",
          Value = "Shop Now",
          Description = "Text của nút CTA hero section",
          Category = "Homepage",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "featured_section_title",
          Value = "Featured Watches",
          Description = "Tiêu đề phần sản phẩm nổi bật",
          Category = "Homepage",
          DataType = "text"
        },

        // Navigation Menu
        new WebsiteSettings
        {
          Key = "menu_items",
          Value = "[{\"label\":\"Home\",\"url\":\"/\"},{\"label\":\"Watches\",\"url\":\"/watches\"},{\"label\":\"Brands\",\"url\":\"/brands\"},{\"label\":\"About\",\"url\":\"/about\"},{\"label\":\"Contact\",\"url\":\"/contact\"}]",
          Description = "Menu items (JSON format)",
          Category = "Navigation",
          DataType = "json"
        },
        new WebsiteSettings
        {
          Key = "show_search_in_header",
          Value = "true",
          Description = "Hiển thị tìm kiếm ở header",
          Category = "Navigation",
          DataType = "boolean"
        },

        // Footer
        new WebsiteSettings
        {
          Key = "footer_about",
          Value = "Watch Store is your trusted destination for premium watches from around the world.",
          Description = "Nội dung About ở footer",
          Category = "Footer",
          DataType = "textarea"
        },
        new WebsiteSettings
        {
          Key = "footer_copyright",
          Value = "© 2025 Watch Store. All rights reserved.",
          Description = "Text copyright",
          Category = "Footer",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "social_facebook",
          Value = "https://facebook.com/watchstore",
          Description = "Link Facebook",
          Category = "Footer",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "social_instagram",
          Value = "https://instagram.com/watchstore",
          Description = "Link Instagram",
          Category = "Footer",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "social_twitter",
          Value = "https://twitter.com/watchstore",
          Description = "Link Twitter",
          Category = "Footer",
          DataType = "text"
        },

        // SEO
        new WebsiteSettings
        {
          Key = "meta_title",
          Value = "Watch Store - Premium Watches Collection",
          Description = "Meta title cho SEO",
          Category = "SEO",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "meta_description",
          Value = "Shop luxury watches from top brands. Free shipping, authentic products, and expert customer service.",
          Description = "Meta description cho SEO",
          Category = "SEO",
          DataType = "textarea"
        },
        new WebsiteSettings
        {
          Key = "meta_keywords",
          Value = "watches, luxury watches, premium watches, watch store, Rolex, Omega, Seiko",
          Description = "Meta keywords cho SEO",
          Category = "SEO",
          DataType = "text"
        },

        // Features
        new WebsiteSettings
        {
          Key = "enable_reviews",
          Value = "true",
          Description = "Bật/tắt tính năng đánh giá",
          Category = "Features",
          DataType = "boolean"
        },
        new WebsiteSettings
        {
          Key = "enable_wishlist",
          Value = "true",
          Description = "Bật/tắt tính năng wishlist",
          Category = "Features",
          DataType = "boolean"
        },
        new WebsiteSettings
        {
          Key = "products_per_page",
          Value = "12",
          Description = "Số sản phẩm mỗi trang",
          Category = "Features",
          DataType = "number"
        }
      };

            await context.WebsiteSettings.AddRangeAsync(settings);
            await context.SaveChangesAsync();
        }
    }
}
