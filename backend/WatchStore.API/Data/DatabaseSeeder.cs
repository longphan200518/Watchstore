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

            // Seed Categories
            if (!context.Categories.Any())
            {
                await SeedCategories(context);
            }

            // Seed Watches
            if (!context.Watches.Any())
            {
                await SeedWatches(context);
            }

            // Always run this once to inject 40 additional watches
            var watchCount = await context.Watches.CountAsync();
            if (watchCount < 50) {
                // await SeedAdditional40Watches(context);
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
                new Brand { Name = "Orient", Description = "Japanese watch brand offering mechanical watches at accessible prices", LogoUrl = "https://www.orientwatch.com/images/orient-logo.png", Country = "Japan" },
                new Brand { Name = "Tag Heuer", Description = "Swiss luxury watchmaker known for sports and racing watches", LogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/TAG_Heuer_logo.svg/200px-TAG_Heuer_logo.svg.png", Country = "Switzerland" },
                new Brand { Name = "Longines", Description = "Swiss watch brand with a rich history of elegance and precision", LogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Longines_Logo.svg/200px-Longines_Logo.svg.png", Country = "Switzerland" }
            };

            await context.Brands.AddRangeAsync(brands);
            await context.SaveChangesAsync();
        }

        private static async Task SeedCategories(WatchStoreDbContext context)
        {
            var categories = new List<Category>
            {
                new Category { Name = "Ð?ng h? Nam", Description = "B? suu t?p d?ng h? dành riêng cho nam gi?i, phong cách m?nh m? và l?ch lãm" },
                new Category { Name = "Ð?ng h? N?", Description = "B? suu t?p d?ng h? dành riêng cho n? gi?i, thanh l?ch và tinh t?" },
                new Category { Name = "Ð?ng h? Th? thao", Description = "Ð?ng h? ch?u nu?c, ch?u va d?p cao, dành cho ho?t d?ng th? thao" },
                new Category { Name = "Ð?ng h? L?n", Description = "Ð?ng h? chuyên d?ng cho l?n bi?n, ch?u áp su?t nu?c sâu" },
                new Category { Name = "Ð?ng h? D? ti?c", Description = "Ð?ng h? thanh l?ch sang tr?ng dành cho các bu?i d? ti?c và s? ki?n" },
                new Category { Name = "Ð?ng h? C? di?n", Description = "Thi?t k? truy?n th?ng, mang phong cách vintage và c? di?n" }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        private static async Task SeedWatches(WatchStoreDbContext context)
        {
            var brands = await context.Brands.ToListAsync();
            var categories = await context.Categories.ToListAsync();

            var rolex    = brands.First(b => b.Name == "Rolex");
            var omega    = brands.First(b => b.Name == "Omega");
            var seiko    = brands.First(b => b.Name == "Seiko");
            var casio    = brands.First(b => b.Name == "Casio");
            var citizen  = brands.First(b => b.Name == "Citizen");
            var orient   = brands.First(b => b.Name == "Orient");

            var catNam = categories.First(c => c.Id == 1);
            var catNu = categories.First(c => c.Id == 2);
            var catTheThao = categories.First(c => c.Id == 3);
            var catLan = categories.First(c => c.Id == 4);
            var catDuTiec = categories.First(c => c.Id == 5);
            var catCoDien = categories.First(c => c.Id == 6);

            var watches = new List<Watch>
            {
                // -- ROLEX ------------------------------------------
                new Watch
                {
                    Name = "Rolex Submariner Date 126610LN",
                    Description = "Huy?n tho?i d?ng h? l?n c?a Rolex, m?t s? den v?i bezel ceramic den. Ð?ng h? dành cho nh?ng quý ông yêu bi?n.",
                    Price = 285000000, StockQuantity = 5,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catLan.Id,
                    CaseSize = "41mm", Movement = "T? d?ng Caliber 3235",
                    Functions = "Ngày, Bezel xoay m?t chi?u", Thickness = "12.5mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Oystersteel", BandMaterial = "Dây Oystersteel",
                    WaterResistance = "300m", Warranty = "5 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1548171915-e04d93cb1c59?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Rolex Datejust 126234",
                    Description = "Ð?ng h? nam c? di?n v?i m?t s? xanh lá Rolesor vàng tr?ng. Bi?u tu?ng c?a s? thanh l?ch và d?ng c?p.",
                    Price = 245000000, StockQuantity = 8,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catCoDien.Id,
                    CaseSize = "36mm", Movement = "T? d?ng Caliber 3235",
                    Functions = "Ngày, kính lúp Cyclops", Thickness = "11.5mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Oystersteel", BandMaterial = "Dây Jubilee",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Rolex GMT-Master II Pepsi 126710BLRO",
                    Description = "Ð?ng h? du l?ch 2 múi gi? v?i bezel ceramic xanh d? huy?n tho?i 'Pepsi'. Dành cho nh?ng nhà du hành.",
                    Price = 315000000, StockQuantity = 3,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catNam.Id,
                    CaseSize = "40mm", Movement = "T? d?ng Caliber 3285",
                    Functions = "GMT, Ngày", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Oystersteel", BandMaterial = "Dây Jubilee",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Rolex Day-Date 40 Vàng 18k",
                    Description = "Chi?c d?ng h? c?a các t?ng th?ng và nguyên th? qu?c gia. V? vàng 18k v?i dây President sang tr?ng.",
                    Price = 980000000, StockQuantity = 2,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catDuTiec.Id,
                    CaseSize = "40mm", Movement = "T? d?ng Caliber 3255",
                    Functions = "Ngày, Th?", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Vàng 18k", BandMaterial = "Dây President Vàng 18k",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Rolex Lady-Datejust 28 H?ng",
                    Description = "Ð?ng h? n? quý phái v?i m?t s? h?ng và dây Rolesor vàng h?ng. Tinh t?, sang tr?ng cho phái d?p.",
                    Price = 235000000, StockQuantity = 6,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catNu.Id,
                    CaseSize = "28mm", Movement = "T? d?ng Caliber 2236",
                    Functions = "Ngày, kính lúp Cyclops", Thickness = "10.5mm", BandWidth = "13mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Rolesor Vàng H?ng", BandMaterial = "Dây Jubilee",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=600&q=80", IsPrimary = true } }
                },

                // -- OMEGA ------------------------------------------
                new Watch
                {
                    Name = "Omega Speedmaster Moonwatch 310.30.42.50.01.001",
                    Description = "Chi?c d?ng h? lên m?t trang huy?n tho?i c?a NASA. Chronograph co th? công mang theo l?ch s? chinh ph?c không gian.",
                    Price = 168000000, StockQuantity = 10,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Co th? công Caliber 3861 Master Chronometer",
                    Functions = "Chronograph, Tachymeter", Thickness = "13.2mm", BandWidth = "20mm",
                    Crystal = "Kính Hesalite", CaseMaterial = "Thép không g?", BandMaterial = "Dây thép không g?",
                    WaterResistance = "50m", Warranty = "5 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Omega Seamaster Diver 300M Blue 210.30.42.20.03.001",
                    Description = "Ð?ng h? l?n chuyên nghi?p v?i m?t s? xanh cobalt tuy?t d?p. Ngu?i b?n d?ng hành c?a di?p viên 007.",
                    Price = 148000000, StockQuantity = 12,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catLan.Id,
                    CaseSize = "42mm", Movement = "T? d?ng Co-Axial Master Chronometer 8800",
                    Functions = "Ngày, Bezel xoay, Van thoát helium", Thickness = "13.5mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g?", BandMaterial = "Dây rubber xanh",
                    WaterResistance = "300m", Warranty = "5 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1594576722512-582bcd3e4e49?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Omega De Ville Prestige Co-Axial",
                    Description = "Ð?ng h? d? ti?c siêu m?ng v?i thi?t k? d?ng h? b? túi c? di?n. Tinh t? và d?ng c?p cho m?i d?p.",
                    Price = 105000000, StockQuantity = 8,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catDuTiec.Id,
                    CaseSize = "39.5mm", Movement = "T? d?ng Co-Axial 2500",
                    Functions = "Ngày", Thickness = "9.5mm", BandWidth = "19mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g?", BandMaterial = "Dây da cá s?u",
                    WaterResistance = "30m", Warranty = "5 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Omega Constellation Ladies 28mm",
                    Description = "Ð?ng h? n? Omega Constellation v?i 8 sao dính trên bezel vàng, m?t s? xà c? tr?ng tinh khi?t.",
                    Price = 118000000, StockQuantity = 7,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catNu.Id,
                    CaseSize = "28mm", Movement = "T? d?ng Co-Axial 8800",
                    Functions = "Ngày", Thickness = "10.9mm", BandWidth = "14mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Rolesor vàng h?ng", BandMaterial = "Dây rolesor vàng h?ng",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Omega Aqua Terra 150M 41mm",
                    Description = "Ð?ng h? da nang th? thao - l?ch lãm v?i m?t s? s?c teak d?c trung. Phù h?p m?i d?p, t? van phòng d?n bi?n.",
                    Price = 152000000, StockQuantity = 9,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catNam.Id,
                    CaseSize = "41mm", Movement = "T? d?ng Co-Axial Master Chronometer 8900",
                    Functions = "Ngày", Thickness = "12.5mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g?", BandMaterial = "Dây thép không g?",
                    WaterResistance = "150m", Warranty = "5 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=600&q=80", IsPrimary = true } }
                },

                // -- SEIKO ------------------------------------------
                new Watch
                {
                    Name = "Seiko Prospex Turtle SPB153J1",
                    Description = "Ð?ng h? l?n co t? d?ng ki?u dáng Rùa huy?n tho?i. B?n b?, ch?ng nu?c 200m, lý tu?ng cho th? l?n nghi?p du.",
                    Price = 18500000, StockQuantity = 18,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catLan.Id,
                    CaseSize = "45mm", Movement = "T? d?ng Caliber 6R35",
                    Functions = "Ngày, Bezel xoay m?t chi?u", Thickness = "13mm", BandWidth = "22mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g?", BandMaterial = "Dây silicone",
                    WaterResistance = "200m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1638131855001-8b476c5741e4?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Seiko Presage Cocktail White Birch SRPG27J1",
                    Description = "Ð?ng h? co Presage m?t s? B?ch Duong tr?ng, l?y c?m h?ng t? cây b?ch duong mùa dông. Sang tr?ng và d?c dáo.",
                    Price = 12800000, StockQuantity = 22,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catCoDien.Id,
                    CaseSize = "40.5mm", Movement = "T? d?ng Caliber 4R35",
                    Functions = "Ngày", Thickness = "11.8mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g?", BandMaterial = "Dây da màu nâu",
                    WaterResistance = "50m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1627386538380-5a9a23a12d22?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Seiko 5 Sports Street Fighter SRPF19K1 Ryu",
                    Description = "Phiên b?n gi?i h?n h?p tác Street Fighter. M?t s? xanh nu?c bi?n thi?t k? d?c s?c. Ch? có s? lu?ng h?u h?n!",
                    Price = 9200000, StockQuantity = 15,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42.5mm", Movement = "T? d?ng Caliber 4R36",
                    Functions = "Ngày, Th?", Thickness = "13.4mm", BandWidth = "22mm",
                    Crystal = "Kính Hardlex", CaseMaterial = "Thép không g?", BandMaterial = "Dây thép không g?",
                    WaterResistance = "100m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1641133618699-8d44bf48e7b7?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Seiko Astron GPS Solar SSH023J1",
                    Description = "Ð?ng h? GPS Solar t? d?ng b? gi? chính xác nh?t th? gi?i. V? titan siêu nh?, b?n b?, không c?n thay pin.",
                    Price = 35000000, StockQuantity = 8,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catNam.Id,
                    CaseSize = "42.8mm", Movement = "GPS Solar Caliber 5X53",
                    Functions = "GPS Ð?ng b?, Dual Time, L?ch v?n niên", Thickness = "12.2mm", BandWidth = "22mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Titan", BandMaterial = "Dây titan",
                    WaterResistance = "100m", Warranty = "3 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Seiko Lukia Women's SSH105J1",
                    Description = "Ð?ng h? n? Seiko Lukia v?i m?t s? xà c? h?ng c?c k? n? tính. Nang lu?ng m?t tr?i, không c?n thay pin.",
                    Price = 8900000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catNu.Id,
                    CaseSize = "29.8mm", Movement = "Solar Caliber V157",
                    Functions = "Ngày", Thickness = "9.2mm", BandWidth = "12mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? xi vàng h?ng", BandMaterial = "Dây thép xi vàng h?ng",
                    WaterResistance = "30m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80", IsPrimary = true } }
                },

                // -- CASIO ------------------------------------------
                new Watch
                {
                    Name = "Casio G-Shock Mudmaster GWG-2000-1A3",
                    Description = "G-Shock d?nh cao dành cho d?a hình kh?c nghi?t. Ch?ng bùn d?t, nang lu?ng m?t tr?i, radio d?ng b? gi? toàn c?u.",
                    Price = 18500000, StockQuantity = 15,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catTheThao.Id,
                    CaseSize = "56.2mm", Movement = "Tough Solar Quartz",
                    Functions = "La bàn, Nhi?t k?, Ðo cao, Bu?c chân, Radio sync", Thickness = "18.6mm", BandWidth = "26mm",
                    Crystal = "Kính khoáng ch?ng tr?y", CaseMaterial = "Resin carbon s?i + Thép", BandMaterial = "Dây resin",
                    WaterResistance = "200m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Casio G-Shock CasiOak GA-2110SU-3A",
                    Description = "CasiOak phong cách du?ng ph? v?i màu xanh lá army c?c cool. Nh? g?n, b?n b?, thích h?p th?i trang hàng ngày.",
                    Price = 4200000, StockQuantity = 40,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catTheThao.Id,
                    CaseSize = "45.4mm", Movement = "Quartz s?-kim",
                    Functions = "World time, Ð?ng h? b?m giây, Ðèn LED", Thickness = "11.8mm", BandWidth = "25mm",
                    Crystal = "Kính khoáng", CaseMaterial = "Carbon + Resin", BandMaterial = "Dây resin",
                    WaterResistance = "200m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Casio Edifice Bluetooth EQB-1100XD-1A",
                    Description = "Ð?ng h? th? thao k?t n?i Bluetooth, solar, thi?t k? Racing. Ð?ng b? gi? v?i di?n tho?i, hi?n th? thông tin smartphone.",
                    Price = 9800000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catNam.Id,
                    CaseSize = "47mm", Movement = "Tough Solar Quartz + Bluetooth",
                    Functions = "Bluetooth, Chronograph, World Time, Solar", Thickness = "12.1mm", BandWidth = "22mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? + Carbon", BandMaterial = "Dây thép không g?",
                    WaterResistance = "100m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Casio Vintage A168WA-1 Gold",
                    Description = "Ð?ng h? retro 8x huy?n tho?i v?i vi?n vàng l?p lánh. Bi?u tu?ng van hóa du?ng ph?, tr? l?i m?nh m? trong th?i trang unisex.",
                    Price = 1500000, StockQuantity = 60,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catCoDien.Id,
                    CaseSize = "36.8mm", Movement = "Quartz s?",
                    Functions = "Báo th?c, B?m giây, Ðèn LED, L?ch", Thickness = "9.6mm", BandWidth = "18mm",
                    Crystal = "Kính Acrylic", CaseMaterial = "Thép không g? xi vàng", BandMaterial = "Dây thép xi vàng",
                    WaterResistance = "30m", Warranty = "1 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1646832000000-e8c2571ccd24?w=600&q=80", IsPrimary = true } }
                },

                // -- CITIZEN ------------------------------------------
                new Watch
                {
                    Name = "Citizen Promaster Marine BN0196-01L",
                    Description = "Ð?ng h? l?n Eco-Drive chuyên nghi?p, ISO 6425 certified. Hành trang không th? thi?u c?a th? l?n chuyên nghi?p.",
                    Price = 12800000, StockQuantity = 18,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catLan.Id,
                    CaseSize = "44mm", Movement = "Eco-Drive Solar",
                    Functions = "Ngày, Bezel xoay, Ch?ng nh?n ISO 6425", Thickness = "12.7mm", BandWidth = "22mm",
                    Crystal = "Kính khoáng", CaseMaterial = "Thép không g?", BandMaterial = "Dây polyurethane",
                    WaterResistance = "200m", Warranty = "5 nam Eco-Drive",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Citizen Exceed Perpetual Calendar CB3030-76L",
                    Description = "Ð?ng h? Radio-Controlled Solar, d?ng b? sóng radio nguyên t?. L?ch v?n niên, không bao gi? sai dù qua T?t Nguyên Ðán.",
                    Price = 22000000, StockQuantity = 12,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catNam.Id,
                    CaseSize = "41mm", Movement = "Radio-Controlled Eco-Drive",
                    Functions = "Radio sync, L?ch v?n niên, Dual time", Thickness = "10.7mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Titan", BandMaterial = "Dây titan",
                    WaterResistance = "100m", Warranty = "5 nam Eco-Drive",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Citizen L Eco-Drive EM0920-13A N?",
                    Description = "Ð?ng h? n? Citizen L v?i m?t s? xà c? tr?ng, dính dá zirconia tinh t?. Solar không c?n thay pin, thân thi?n môi tru?ng.",
                    Price = 7800000, StockQuantity = 22,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catNu.Id,
                    CaseSize = "32mm", Movement = "Eco-Drive Solar",
                    Functions = "Ngày", Thickness = "9mm", BandWidth = "12mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? xi vàng h?ng", BandMaterial = "Dây thép xi vàng h?ng",
                    WaterResistance = "50m", Warranty = "5 nam Eco-Drive",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1596944924591-2a9eba0bfb73?w=600&q=80", IsPrimary = true } }
                },

                // -- ORIENT ------------------------------------------
                new Watch
                {
                    Name = "Orient Bambino Gen 5 Classic FAC0000EB0",
                    Description = "Ð?ng h? c? di?n phong cách d?ng h? b? túi v?i m?t kính dome d?ng vòm. Co t? d?ng, giá tr? vu?t tr?i phân khúc.",
                    Price = 5800000, StockQuantity = 25,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catCoDien.Id,
                    CaseSize = "40.5mm", Movement = "T? d?ng Caliber F6724",
                    Functions = "Gi?, Phút, Giây", Thickness = "11.8mm", BandWidth = "21mm",
                    Crystal = "Kính khoáng dome", CaseMaterial = "Thép không g?", BandMaterial = "Dây da nâu",
                    WaterResistance = "30m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Orient Kamasu Diver RA-AA0004E19B",
                    Description = "Ð?ng h? l?n co t? d?ng giá t?t nh?t phân khúc. Kính Sapphire, bezel ceramic, ch?ng nu?c 200m. Best value diver!",
                    Price = 7200000, StockQuantity = 22,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catLan.Id,
                    CaseSize = "41.8mm", Movement = "T? d?ng Caliber F6922",
                    Functions = "Ngày, Th?, Bezel xoay", Thickness = "12.8mm", BandWidth = "22mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g?", BandMaterial = "Dây thép không g?",
                    WaterResistance = "200m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Orient Sun and Moon Open Heart RA-AS0103R10B",
                    Description = "Ð?ng h? co t? d?ng v?i ch? th? M?t Tr?i / M?t Trang và l? h?ng trái tim nhìn th?y b? máy chuy?n d?ng.",
                    Price = 9800000, StockQuantity = 15,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catDuTiec.Id,
                    CaseSize = "42mm", Movement = "T? d?ng Caliber F6B24",
                    Functions = "Ngày, Ch? th? M?t Trang, Open Heart", Thickness = "13.2mm", BandWidth = "22mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g?", BandMaterial = "Dây da nâu",
                    WaterResistance = "50m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Orient N? RA-NB0101S10B Crystal Hoa",
                    Description = "Ð?ng h? n? Orient v?i m?t kính n?i b?t dính pha lê Swarovski. Co t? d?ng l? máy, tinh t? và d?c bi?t.",
                    Price = 6500000, StockQuantity = 18,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catNu.Id,
                    CaseSize = "30mm", Movement = "T? d?ng Caliber F5S22",
                    Functions = "L? máy co", Thickness = "10.5mm", BandWidth = "16mm",
                    Crystal = "Kính khoáng + Pha lê Swarovski", CaseMaterial = "Thép không g?", BandMaterial = "Dây da tr?ng",
                    WaterResistance = "50m", Warranty = "2 nam b?o hành qu?c t?",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80", IsPrimary = true } }
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
          Description = "Tagline/slogan c?a website",
          Category = "General",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "site_description",
          Value = "Discover luxury and style with our curated collection of premium watches",
          Description = "Mô t? website",
          Category = "General",
          DataType = "textarea"
        },
        new WebsiteSettings
        {
          Key = "contact_email",
          Value = "contact@watchstore.com",
          Description = "Email liên h?",
          Category = "General",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "contact_phone",
          Value = "+84 123 456 789",
          Description = "S? di?n tho?i liên h?",
          Category = "General",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "contact_address",
          Value = "123 Watch Street, Hanoi, Vietnam",
          Description = "Ð?a ch? liên h?",
          Category = "General",
          DataType = "textarea"
        },

        // Branding
        new WebsiteSettings
        {
          Key = "logo_url",
          Value = "https://via.placeholder.com/200x60?text=Watch+Store",
          Description = "URL c?a logo",
          Category = "Branding",
          DataType = "image"
        },
        new WebsiteSettings
        {
          Key = "favicon_url",
          Value = "https://via.placeholder.com/32x32?text=WS",
          Description = "URL c?a favicon",
          Category = "Branding",
          DataType = "image"
        },
        new WebsiteSettings
        {
          Key = "primary_color",
          Value = "#3B82F6",
          Description = "Màu ch? d?o c?a website",
          Category = "Branding",
          DataType = "color"
        },
        new WebsiteSettings
        {
          Key = "secondary_color",
          Value = "#10B981",
          Description = "Màu ph? c?a website",
          Category = "Branding",
          DataType = "color"
        },

        // Homepage
        new WebsiteSettings
        {
          Key = "hero_title",
          Value = "Discover Timeless Elegance",
          Description = "Tiêu d? hero section",
          Category = "Homepage",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "hero_subtitle",
          Value = "Explore our collection of premium watches from world-renowned brands",
          Description = "Ph? d? hero section",
          Category = "Homepage",
          DataType = "textarea"
        },
        new WebsiteSettings
        {
          Key = "hero_image",
          Value = "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          Description = "?nh n?n hero section",
          Category = "Homepage",
          DataType = "image"
        },
        new WebsiteSettings
        {
          Key = "hero_cta_text",
          Value = "Shop Now",
          Description = "Text c?a nút CTA hero section",
          Category = "Homepage",
          DataType = "text"
        },
        new WebsiteSettings
        {
          Key = "featured_section_title",
          Value = "Featured Watches",
          Description = "Tiêu d? ph?n s?n ph?m n?i b?t",
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
          Description = "Hi?n th? tìm ki?m ? header",
          Category = "Navigation",
          DataType = "boolean"
        },

        // Footer
        new WebsiteSettings
        {
          Key = "footer_about",
          Value = "Watch Store is your trusted destination for premium watches from around the world.",
          Description = "N?i dung About ? footer",
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
          Description = "B?t/t?t tính nang dánh giá",
          Category = "Features",
          DataType = "boolean"
        },
        new WebsiteSettings
        {
          Key = "enable_wishlist",
          Value = "true",
          Description = "B?t/t?t tính nang wishlist",
          Category = "Features",
          DataType = "boolean"
        },
        new WebsiteSettings
        {
          Key = "products_per_page",
          Value = "12",
          Description = "S? s?n ph?m m?i trang",
          Category = "Features",
          DataType = "number"
        }
      };

            await context.WebsiteSettings.AddRangeAsync(settings);
            await context.SaveChangesAsync();
        }

        public static async Task SeedAdditional40Watches(WatchStoreDbContext context)
        {
            var brands = await context.Brands.ToListAsync();
            var categories = await context.Categories.ToListAsync();

            var rolex    = brands.First(b => b.Name == "Rolex");
            var omega    = brands.First(b => b.Name == "Omega");
            var seiko    = brands.First(b => b.Name == "Seiko");
            var casio    = brands.First(b => b.Name == "Casio");
            var citizen  = brands.First(b => b.Name == "Citizen");
            var orient   = brands.First(b => b.Name == "Orient");
            var tagHeuer = brands.First(b => b.Name == "Tag Heuer");
            var longines = brands.First(b => b.Name == "Longines");

            var catNam = categories.First(c => c.Id == 1);
            var catNu = categories.First(c => c.Id == 2);
            var catTheThao = categories.First(c => c.Id == 3);
            var catLan = categories.First(c => c.Id == 4);
            var catDuTiec = categories.First(c => c.Id == 5);
            var catCoDien = categories.First(c => c.Id == 6);

            var watches = new List<Watch>
            {

                new Watch
                {
                    Name = "Daytona Cosmograph",
                    Description = "Ð?ng h? b?m gi? th? thao huy?n tho?i, thi?t k? dành riêng cho các tay dua chuyên nghi?p.",
                    Price = 450000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1548171915-e04d93cb1c59?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "GMT-Master II Batman",
                    Description = "Phiên b?n vi?n xanh den n?i ti?ng, cho phép theo dõi múi gi? th? hai m?t cách hoàn h?o.",
                    Price = 380000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1587836141338-01e40eb352ff?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Oyster Perpetual 41",
                    Description = "Bi?u tu?ng c?a s? thanh l?ch và tinh t? t? Rolex, v?i m?t s? da d?ng màu s?c.",
                    Price = 150000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catNam.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Sea-Dweller Deepsea",
                    Description = "Kh? nang ch?ng nu?c c?c d?nh lên d?n 3900m, ngu?i b?n d?ng hành cho nh?ng th? l?n.",
                    Price = 320000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catLan.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Sky-Dweller",
                    Description = "C? máy th?i gian ph?c t?p nh?t c?a Rolex v?i l?ch thu?ng niên và hi?n th? múi gi? kép.",
                    Price = 420000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catNam.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Speedmaster Moonwatch",
                    Description = "Chi?c d?ng h? d?u tiên lên m?t trang, mang giá tr? l?ch s? và b? máy co h?c xu?t chúng.",
                    Price = 180000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Seamaster Aqua Terra",
                    Description = "S? k?t h?p hoàn h?o gi?a nét thanh l?ch trên b? và d? b?n b? du?i nu?c.",
                    Price = 145000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catNam.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Seamaster Planet Ocean",
                    Description = "Ð?ng h? l?n chuyên nghi?p v?i van thoát khí helium và vi?n ceramic n?i b?t.",
                    Price = 165000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catLan.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1548171915-e04d93cb1c59?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Constellation Globemaster",
                    Description = "Thi?t k? m?t s? 'Pie Pan' c? di?n cùng ch?ng nh?n Master Chronometer.",
                    Price = 190000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catCoDien.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "De Ville Trésor",
                    Description = "Tuy?t tác siêu m?ng dành cho nam gi?i, tôn lên nét thanh l?ch c?a các quý ông.",
                    Price = 210000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catDuTiec.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Prospex LX Spring Drive",
                    Description = "Trang b? công ngh? Spring Drive d?c quy?n, lu?t kim mu?t mà tuy?t d?i.",
                    Price = 85000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1548171915-e04d93cb1c59?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Presage Cocktail Time",
                    Description = "M?t s? l?y c?m h?ng t? các ly cocktail, vân ch?i tia tuy?t d?p du?i ánh sáng.",
                    Price = 12000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catDuTiec.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "5 Sports SRPD",
                    Description = "Dòng d?ng h? th? thao giá tr? nh?t, da d?ng màu s?c và vô cùng b?n b?.",
                    Price = 7500000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1587836141338-01e40eb352ff?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Astron GPS Solar",
                    Description = "T? d?ng c?p nh?t múi gi? qua GPS b?ng nang lu?ng m?t tr?i.",
                    Price = 45000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catNam.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Prospex 'Turtle'",
                    Description = "Ð?ng h? l?n thi?t k? mai rùa kinh di?n, kh? nang ch?ng nu?c 200m b?n b?.",
                    Price = 11000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catLan.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "G-Shock Mudmaster",
                    Description = "Kh? nang ch?ng bùn d?t và va d?p c?c m?nh, thích h?p môi tru?ng kh?c nghi?t.",
                    Price = 8500000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1548171915-e04d93cb1c59?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Edifice Bluetooth",
                    Description = "K?t n?i smartphone, thi?t k? th? thao l?y c?m h?ng t? xe dua F1.",
                    Price = 6200000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Pro Trek Solar",
                    Description = "Tích h?p la bàn, do d? cao và khí áp k?, ngu?i b?n cho nh?ng chuy?n leo núi.",
                    Price = 9500000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "G-Shock Full Metal",
                    Description = "Phiên b?n kim lo?i toàn ph?n c?a dòng G-Shock c? di?n, sang tr?ng và cá tính.",
                    Price = 14000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catNam.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Vintage Collection",
                    Description = "Thi?t k? di?n t? c? di?n c?a nh?ng nam 80, nh? g?n và th?i trang.",
                    Price = 1200000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catCoDien.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1587836141338-01e40eb352ff?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Eco-Drive Promaster Diver",
                    Description = "Ð?ng h? l?n không c?n thay pin, s? d?ng nang lu?ng ánh sáng d?c quy?n.",
                    Price = 9000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catLan.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1587836141338-01e40eb352ff?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Tsuyosa Automatic",
                    Description = "Thi?t k? dây tích h?p (integrated bracelet) hi?n d?i v?i màu m?t s? r?c r?.",
                    Price = 8500000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catNam.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Eco-Drive Titanium",
                    Description = "Ch?t li?u Super Titanium siêu nh? và ch?ng xu?c t?t hon thép không g? 5 l?n.",
                    Price = 11500000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catNam.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Citizen L",
                    Description = "Dòng d?ng h? n? thanh l?ch v?i viên kim cuong t? do tru?t trên m?t kính.",
                    Price = 14000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catNu.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Calendrier Moonphase",
                    Description = "Hi?n th? chu k? m?t trang và l?ch ngày tháng d?y d?, v? d?p c? di?n.",
                    Price = 10500000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catCoDien.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Bambino Version 2",
                    Description = "Huy?n tho?i dress-watch v?i m?t kính cong vòm và c?c s? La Mã c? di?n.",
                    Price = 6500000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catCoDien.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Kamasu Diver",
                    Description = "Ð?ng h? l?n t? d?ng dáng mua nh?t t?m giá v?i m?t kính sapphire ch?ng xu?c.",
                    Price = 7800000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catLan.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Sun and Moon Gen 5",
                    Description = "Tính nang hi?n th? ngày dêm (Sun/Moon) d?c dáo trên m?t s? nhi?u l?p.",
                    Price = 10200000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catDuTiec.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1587836141338-01e40eb352ff?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Star Classic",
                    Description = "Dòng s?n ph?m cao c?p c?a Orient, d? hoàn thi?n tinh x?o v?i kim báo nang lu?ng.",
                    Price = 18500000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catNam.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1587836141338-01e40eb352ff?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Mako III",
                    Description = "Ti?p n?i thành công c?a dòng Mako, thi?t k? kh?e kho?n và d? quang c?c sáng.",
                    Price = 7200000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1548171915-e04d93cb1c59?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Carrera Chronograph",
                    Description = "L?y c?m h?ng t? gi?i dua Carrera Panamericana, bi?u tu?ng c?a t?c d?.",
                    Price = 145000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = tagHeuer.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1587836141338-01e40eb352ff?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Aquaracer Professional",
                    Description = "S?n sàng cho m?i di?u ki?n kh?c nghi?t v?i vi?n bezel 12 c?nh d?c dáo.",
                    Price = 85000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = tagHeuer.Id, CategoryId = catLan.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Monaco Calibre 11",
                    Description = "Chi?c d?ng h? m?t vuông huy?n tho?i g?n li?n v?i di?n viên Steve McQueen.",
                    Price = 170000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = tagHeuer.Id, CategoryId = catCoDien.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Formula 1 Quartz",
                    Description = "S? l?a ch?n hoàn h?o cho nh?ng ngu?i dam mê mô tô th? thao.",
                    Price = 42000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = tagHeuer.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Autavia Isograph",
                    Description = "Cân b?ng gi?a nét c? di?n và công ngh? lò xo dây tóc carbon hi?n d?i.",
                    Price = 95000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = tagHeuer.Id, CategoryId = catCoDien.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Master Collection Moonphase",
                    Description = "Ð?nh cao c?a s? thanh l?ch v?i tính nang l?ch tu?n trang ph?c t?p.",
                    Price = 85000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = longines.Id, CategoryId = catDuTiec.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "HydroConquest Ceramic",
                    Description = "Ð?ng h? l?n th? thao v?i vi?n ceramic sáng bóng và ch?ng xu?c.",
                    Price = 45000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = longines.Id, CategoryId = catLan.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Heritage Classic",
                    Description = "Tái hi?n nh?ng tinh hoa trong l?ch s? ch? tác d?ng h? c?a Longines.",
                    Price = 58000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = longines.Id, CategoryId = catCoDien.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1587836141338-01e40eb352ff?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "DolceVita",
                    Description = "Thi?t k? m?t ch? nh?t l?y c?m h?ng t? cu?c s?ng ng?t ngào c?a nu?c Ý.",
                    Price = 38000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = longines.Id, CategoryId = catNu.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1548171915-e04d93cb1c59?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Spirit Zulu Time",
                    Description = "Ð?ng h? GMT dành cho nh?ng phi công và nh?ng nhà thám hi?m hi?n d?i.",
                    Price = 75000000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = longines.Id, CategoryId = catNam.Id,
                    CaseSize = "42mm", Movement = "Automatic",
                    Functions = "Gi?, Phút, Giây", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không g? 316L", BandMaterial = "Dây thép nguyên kh?i",
                    WaterResistance = "100m", Warranty = "5 nam b?o hành",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=600&q=80", IsPrimary = true } }
                }
            };

            await context.Watches.AddRangeAsync(watches);
            await context.SaveChangesAsync();
        }

    }
}

