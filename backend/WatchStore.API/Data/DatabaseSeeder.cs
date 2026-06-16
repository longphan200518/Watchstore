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
                new Category { Name = "Đồng hồ Nam", Description = "Bộ sưu tập đồng hồ dành riêng cho nam giới, phong cách mạnh mẽ và lịch lãm" },
                new Category { Name = "Đồng hồ Nữ", Description = "Bộ sưu tập đồng hồ dành riêng cho nữ giới, thanh lịch và tinh tế" },
                new Category { Name = "Đồng hồ Thể thao", Description = "Đồng hồ chịu nước, chịu va đập cao, dành cho hoạt động thể thao" },
                new Category { Name = "Đồng hồ Lặn", Description = "Đồng hồ chuyên dụng cho lặn biển, chịu áp suất nước sâu" },
                new Category { Name = "Đồng hồ Dự tiệc", Description = "Đồng hồ thanh lịch sang trọng dành cho các buổi dự tiệc và sự kiện" },
                new Category { Name = "Đồng hồ Cổ điển", Description = "Thiết kế truyền thống, mang phong cách vintage và cổ điển" }
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

            var catNam      = categories.First(c => c.Name == "Đồng hồ Nam");
            var catNu       = categories.First(c => c.Name == "Đồng hồ Nữ");
            var catTheThao  = categories.First(c => c.Name == "Đồng hồ Thể thao");
            var catLan      = categories.First(c => c.Name == "Đồng hồ Lặn");
            var catDuTiec   = categories.First(c => c.Name == "Đồng hồ Dự tiệc");
            var catCoDien   = categories.First(c => c.Name == "Đồng hồ Cổ điển");

            var watches = new List<Watch>
            {
                // ── ROLEX ──────────────────────────────────────────
                new Watch
                {
                    Name = "Rolex Submariner Date 126610LN",
                    Description = "Huyền thoại đồng hồ lặn của Rolex, mặt số đen với bezel ceramic đen. Đồng hồ dành cho những quý ông yêu biển.",
                    Price = 285000000, StockQuantity = 5,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catLan.Id,
                    CaseSize = "41mm", Movement = "Tự động Caliber 3235",
                    Functions = "Ngày, Bezel xoay một chiều", Thickness = "12.5mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Oystersteel", BandMaterial = "Dây Oystersteel",
                    WaterResistance = "300m", Warranty = "5 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1548171915-e04d93cb1c59?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Rolex Datejust 126234",
                    Description = "Đồng hồ nam cổ điển với mặt số xanh lá Rolesor vàng trắng. Biểu tượng của sự thanh lịch và đẳng cấp.",
                    Price = 245000000, StockQuantity = 8,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catCoDien.Id,
                    CaseSize = "36mm", Movement = "Tự động Caliber 3235",
                    Functions = "Ngày, kính lúp Cyclops", Thickness = "11.5mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Oystersteel", BandMaterial = "Dây Jubilee",
                    WaterResistance = "100m", Warranty = "5 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Rolex GMT-Master II Pepsi 126710BLRO",
                    Description = "Đồng hồ du lịch 2 múi giờ với bezel ceramic xanh đỏ huyền thoại 'Pepsi'. Dành cho những nhà du hành.",
                    Price = 315000000, StockQuantity = 3,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catNam.Id,
                    CaseSize = "40mm", Movement = "Tự động Caliber 3285",
                    Functions = "GMT, Ngày", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Oystersteel", BandMaterial = "Dây Jubilee",
                    WaterResistance = "100m", Warranty = "5 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Rolex Day-Date 40 Vàng 18k",
                    Description = "Chiếc đồng hồ của các tổng thống và nguyên thủ quốc gia. Vỏ vàng 18k với dây President sang trọng.",
                    Price = 980000000, StockQuantity = 2,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catDuTiec.Id,
                    CaseSize = "40mm", Movement = "Tự động Caliber 3255",
                    Functions = "Ngày, Thứ", Thickness = "12mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Vàng 18k", BandMaterial = "Dây President Vàng 18k",
                    WaterResistance = "100m", Warranty = "5 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Rolex Lady-Datejust 28 Hồng",
                    Description = "Đồng hồ nữ quý phái với mặt số hồng và dây Rolesor vàng hồng. Tinh tế, sang trọng cho phái đẹp.",
                    Price = 235000000, StockQuantity = 6,
                    Status = WatchStatus.Available,
                    BrandId = rolex.Id, CategoryId = catNu.Id,
                    CaseSize = "28mm", Movement = "Tự động Caliber 2236",
                    Functions = "Ngày, kính lúp Cyclops", Thickness = "10.5mm", BandWidth = "13mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Rolesor Vàng Hồng", BandMaterial = "Dây Jubilee",
                    WaterResistance = "100m", Warranty = "5 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=600&q=80", IsPrimary = true } }
                },

                // ── OMEGA ──────────────────────────────────────────
                new Watch
                {
                    Name = "Omega Speedmaster Moonwatch 310.30.42.50.01.001",
                    Description = "Chiếc đồng hồ lên mặt trăng huyền thoại của NASA. Chronograph cơ thủ công mang theo lịch sử chinh phục không gian.",
                    Price = 168000000, StockQuantity = 10,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42mm", Movement = "Cơ thủ công Caliber 3861 Master Chronometer",
                    Functions = "Chronograph, Tachymeter", Thickness = "13.2mm", BandWidth = "20mm",
                    Crystal = "Kính Hesalite", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây thép không gỉ",
                    WaterResistance = "50m", Warranty = "5 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Omega Seamaster Diver 300M Blue 210.30.42.20.03.001",
                    Description = "Đồng hồ lặn chuyên nghiệp với mặt số xanh cobalt tuyệt đẹp. Người bạn đồng hành của điệp viên 007.",
                    Price = 148000000, StockQuantity = 12,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catLan.Id,
                    CaseSize = "42mm", Movement = "Tự động Co-Axial Master Chronometer 8800",
                    Functions = "Ngày, Bezel xoay, Van thoát helium", Thickness = "13.5mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây rubber xanh",
                    WaterResistance = "300m", Warranty = "5 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1594576722512-582bcd3e4e49?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Omega De Ville Prestige Co-Axial",
                    Description = "Đồng hồ dự tiệc siêu mỏng với thiết kế đồng hồ bỏ túi cổ điển. Tinh tế và đẳng cấp cho mọi dịp.",
                    Price = 105000000, StockQuantity = 8,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catDuTiec.Id,
                    CaseSize = "39.5mm", Movement = "Tự động Co-Axial 2500",
                    Functions = "Ngày", Thickness = "9.5mm", BandWidth = "19mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây da cá sấu",
                    WaterResistance = "30m", Warranty = "5 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Omega Constellation Ladies 28mm",
                    Description = "Đồng hồ nữ Omega Constellation với 8 sao đính trên bezel vàng, mặt số xà cừ trắng tinh khiết.",
                    Price = 118000000, StockQuantity = 7,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catNu.Id,
                    CaseSize = "28mm", Movement = "Tự động Co-Axial 8800",
                    Functions = "Ngày", Thickness = "10.9mm", BandWidth = "14mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Rolesor vàng hồng", BandMaterial = "Dây rolesor vàng hồng",
                    WaterResistance = "100m", Warranty = "5 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Omega Aqua Terra 150M 41mm",
                    Description = "Đồng hồ đa năng thể thao - lịch lãm với mặt số sọc teak đặc trưng. Phù hợp mọi dịp, từ văn phòng đến biển.",
                    Price = 152000000, StockQuantity = 9,
                    Status = WatchStatus.Available,
                    BrandId = omega.Id, CategoryId = catNam.Id,
                    CaseSize = "41mm", Movement = "Tự động Co-Axial Master Chronometer 8900",
                    Functions = "Ngày", Thickness = "12.5mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây thép không gỉ",
                    WaterResistance = "150m", Warranty = "5 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=600&q=80", IsPrimary = true } }
                },

                // ── SEIKO ──────────────────────────────────────────
                new Watch
                {
                    Name = "Seiko Prospex Turtle SPB153J1",
                    Description = "Đồng hồ lặn cơ tự động kiểu dáng Rùa huyền thoại. Bền bỉ, chống nước 200m, lý tưởng cho thợ lặn nghiệp dư.",
                    Price = 18500000, StockQuantity = 18,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catLan.Id,
                    CaseSize = "45mm", Movement = "Tự động Caliber 6R35",
                    Functions = "Ngày, Bezel xoay một chiều", Thickness = "13mm", BandWidth = "22mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây silicone",
                    WaterResistance = "200m", Warranty = "2 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1638131855001-8b476c5741e4?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Seiko Presage Cocktail White Birch SRPG27J1",
                    Description = "Đồng hồ cơ Presage mặt số Bạch Dương trắng, lấy cảm hứng từ cây bạch dương mùa đông. Sang trọng và độc đáo.",
                    Price = 12800000, StockQuantity = 22,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catCoDien.Id,
                    CaseSize = "40.5mm", Movement = "Tự động Caliber 4R35",
                    Functions = "Ngày", Thickness = "11.8mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây da màu nâu",
                    WaterResistance = "50m", Warranty = "2 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1627386538380-5a9a23a12d22?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Seiko 5 Sports Street Fighter SRPF19K1 Ryu",
                    Description = "Phiên bản giới hạn hợp tác Street Fighter. Mặt số xanh nước biển thiết kế đặc sắc. Chỉ có số lượng hữu hạn!",
                    Price = 9200000, StockQuantity = 15,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catTheThao.Id,
                    CaseSize = "42.5mm", Movement = "Tự động Caliber 4R36",
                    Functions = "Ngày, Thứ", Thickness = "13.4mm", BandWidth = "22mm",
                    Crystal = "Kính Hardlex", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây thép không gỉ",
                    WaterResistance = "100m", Warranty = "2 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1641133618699-8d44bf48e7b7?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Seiko Astron GPS Solar SSH023J1",
                    Description = "Đồng hồ GPS Solar tự đồng bộ giờ chính xác nhất thế giới. Vỏ titan siêu nhẹ, bền bỉ, không cần thay pin.",
                    Price = 35000000, StockQuantity = 8,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catNam.Id,
                    CaseSize = "42.8mm", Movement = "GPS Solar Caliber 5X53",
                    Functions = "GPS Đồng bộ, Dual Time, Lịch vạn niên", Thickness = "12.2mm", BandWidth = "22mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Titan", BandMaterial = "Dây titan",
                    WaterResistance = "100m", Warranty = "3 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Seiko Lukia Women's SSH105J1",
                    Description = "Đồng hồ nữ Seiko Lukia với mặt số xà cừ hồng cực kỳ nữ tính. Năng lượng mặt trời, không cần thay pin.",
                    Price = 8900000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = seiko.Id, CategoryId = catNu.Id,
                    CaseSize = "29.8mm", Movement = "Solar Caliber V157",
                    Functions = "Ngày", Thickness = "9.2mm", BandWidth = "12mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không gỉ xi vàng hồng", BandMaterial = "Dây thép xi vàng hồng",
                    WaterResistance = "30m", Warranty = "2 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80", IsPrimary = true } }
                },

                // ── CASIO ──────────────────────────────────────────
                new Watch
                {
                    Name = "Casio G-Shock Mudmaster GWG-2000-1A3",
                    Description = "G-Shock đỉnh cao dành cho địa hình khắc nghiệt. Chống bùn đất, năng lượng mặt trời, radio đồng bộ giờ toàn cầu.",
                    Price = 18500000, StockQuantity = 15,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catTheThao.Id,
                    CaseSize = "56.2mm", Movement = "Tough Solar Quartz",
                    Functions = "La bàn, Nhiệt kế, Đo cao, Bước chân, Radio sync", Thickness = "18.6mm", BandWidth = "26mm",
                    Crystal = "Kính khoáng chống trầy", CaseMaterial = "Resin carbon sợi + Thép", BandMaterial = "Dây resin",
                    WaterResistance = "200m", Warranty = "2 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Casio G-Shock CasiOak GA-2110SU-3A",
                    Description = "CasiOak phong cách đường phố với màu xanh lá army cực cool. Nhỏ gọn, bền bỉ, thích hợp thời trang hàng ngày.",
                    Price = 4200000, StockQuantity = 40,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catTheThao.Id,
                    CaseSize = "45.4mm", Movement = "Quartz số-kim",
                    Functions = "World time, Đồng hồ bấm giây, Đèn LED", Thickness = "11.8mm", BandWidth = "25mm",
                    Crystal = "Kính khoáng", CaseMaterial = "Carbon + Resin", BandMaterial = "Dây resin",
                    WaterResistance = "200m", Warranty = "2 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Casio Edifice Bluetooth EQB-1100XD-1A",
                    Description = "Đồng hồ thể thao kết nối Bluetooth, solar, thiết kế Racing. Đồng bộ giờ với điện thoại, hiển thị thông tin smartphone.",
                    Price = 9800000, StockQuantity = 20,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catNam.Id,
                    CaseSize = "47mm", Movement = "Tough Solar Quartz + Bluetooth",
                    Functions = "Bluetooth, Chronograph, World Time, Solar", Thickness = "12.1mm", BandWidth = "22mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không gỉ + Carbon", BandMaterial = "Dây thép không gỉ",
                    WaterResistance = "100m", Warranty = "2 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Casio Vintage A168WA-1 Gold",
                    Description = "Đồng hồ retro 8x huyền thoại với viền vàng lấp lánh. Biểu tượng văn hóa đường phố, trở lại mạnh mẽ trong thời trang unisex.",
                    Price = 1500000, StockQuantity = 60,
                    Status = WatchStatus.Available,
                    BrandId = casio.Id, CategoryId = catCoDien.Id,
                    CaseSize = "36.8mm", Movement = "Quartz số",
                    Functions = "Báo thức, Bấm giây, Đèn LED, Lịch", Thickness = "9.6mm", BandWidth = "18mm",
                    Crystal = "Kính Acrylic", CaseMaterial = "Thép không gỉ xi vàng", BandMaterial = "Dây thép xi vàng",
                    WaterResistance = "30m", Warranty = "1 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1646832000000-e8c2571ccd24?w=600&q=80", IsPrimary = true } }
                },

                // ── CITIZEN ──────────────────────────────────────────
                new Watch
                {
                    Name = "Citizen Promaster Marine BN0196-01L",
                    Description = "Đồng hồ lặn Eco-Drive chuyên nghiệp, ISO 6425 certified. Hành trang không thể thiếu của thợ lặn chuyên nghiệp.",
                    Price = 12800000, StockQuantity = 18,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catLan.Id,
                    CaseSize = "44mm", Movement = "Eco-Drive Solar",
                    Functions = "Ngày, Bezel xoay, Chứng nhận ISO 6425", Thickness = "12.7mm", BandWidth = "22mm",
                    Crystal = "Kính khoáng", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây polyurethane",
                    WaterResistance = "200m", Warranty = "5 năm Eco-Drive",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Citizen Exceed Perpetual Calendar CB3030-76L",
                    Description = "Đồng hồ Radio-Controlled Solar, đồng bộ sóng radio nguyên tử. Lịch vạn niên, không bao giờ sai dù qua Tết Nguyên Đán.",
                    Price = 22000000, StockQuantity = 12,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catNam.Id,
                    CaseSize = "41mm", Movement = "Radio-Controlled Eco-Drive",
                    Functions = "Radio sync, Lịch vạn niên, Dual time", Thickness = "10.7mm", BandWidth = "20mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Titan", BandMaterial = "Dây titan",
                    WaterResistance = "100m", Warranty = "5 năm Eco-Drive",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Citizen L Eco-Drive EM0920-13A Nữ",
                    Description = "Đồng hồ nữ Citizen L với mặt số xà cừ trắng, đính đá zirconia tinh tế. Solar không cần thay pin, thân thiện môi trường.",
                    Price = 7800000, StockQuantity = 22,
                    Status = WatchStatus.Available,
                    BrandId = citizen.Id, CategoryId = catNu.Id,
                    CaseSize = "32mm", Movement = "Eco-Drive Solar",
                    Functions = "Ngày", Thickness = "9mm", BandWidth = "12mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không gỉ xi vàng hồng", BandMaterial = "Dây thép xi vàng hồng",
                    WaterResistance = "50m", Warranty = "5 năm Eco-Drive",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1596944924591-2a9eba0bfb73?w=600&q=80", IsPrimary = true } }
                },

                // ── ORIENT ──────────────────────────────────────────
                new Watch
                {
                    Name = "Orient Bambino Gen 5 Classic FAC0000EB0",
                    Description = "Đồng hồ cổ điển phong cách đồng hồ bỏ túi với mặt kính dome dạng vòm. Cơ tự động, giá trị vượt trội phân khúc.",
                    Price = 5800000, StockQuantity = 25,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catCoDien.Id,
                    CaseSize = "40.5mm", Movement = "Tự động Caliber F6724",
                    Functions = "Giờ, Phút, Giây", Thickness = "11.8mm", BandWidth = "21mm",
                    Crystal = "Kính khoáng dome", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây da nâu",
                    WaterResistance = "30m", Warranty = "2 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Orient Kamasu Diver RA-AA0004E19B",
                    Description = "Đồng hồ lặn cơ tự động giá tốt nhất phân khúc. Kính Sapphire, bezel ceramic, chống nước 200m. Best value diver!",
                    Price = 7200000, StockQuantity = 22,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catLan.Id,
                    CaseSize = "41.8mm", Movement = "Tự động Caliber F6922",
                    Functions = "Ngày, Thứ, Bezel xoay", Thickness = "12.8mm", BandWidth = "22mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây thép không gỉ",
                    WaterResistance = "200m", Warranty = "2 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Orient Sun and Moon Open Heart RA-AS0103R10B",
                    Description = "Đồng hồ cơ tự động với chỉ thị Mặt Trời / Mặt Trăng và lỗ hổng trái tim nhìn thấy bộ máy chuyển động.",
                    Price = 9800000, StockQuantity = 15,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catDuTiec.Id,
                    CaseSize = "42mm", Movement = "Tự động Caliber F6B24",
                    Functions = "Ngày, Chỉ thị Mặt Trăng, Open Heart", Thickness = "13.2mm", BandWidth = "22mm",
                    Crystal = "Kính Sapphire", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây da nâu",
                    WaterResistance = "50m", Warranty = "2 năm bảo hành quốc tế",
                    Images = new List<WatchImage> { new WatchImage { ImageUrl = "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&q=80", IsPrimary = true } }
                },
                new Watch
                {
                    Name = "Orient Nữ RA-NB0101S10B Crystal Hoa",
                    Description = "Đồng hồ nữ Orient với mặt kính nổi bật đính pha lê Swarovski. Cơ tự động lộ máy, tinh tế và đặc biệt.",
                    Price = 6500000, StockQuantity = 18,
                    Status = WatchStatus.Available,
                    BrandId = orient.Id, CategoryId = catNu.Id,
                    CaseSize = "30mm", Movement = "Tự động Caliber F5S22",
                    Functions = "Lộ máy cơ", Thickness = "10.5mm", BandWidth = "16mm",
                    Crystal = "Kính khoáng + Pha lê Swarovski", CaseMaterial = "Thép không gỉ", BandMaterial = "Dây da trắng",
                    WaterResistance = "50m", Warranty = "2 năm bảo hành quốc tế",
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
