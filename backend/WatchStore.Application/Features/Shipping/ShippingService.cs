using Microsoft.Extensions.Logging;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Interfaces;
using System.Net.Http;
using System.Net.Http.Json;

namespace WatchStore.Application.Features.Shipping
{
    public class ShippingService : BaseService, IShippingService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;

        public ShippingService(IServiceFacade facade, IHttpClientFactory httpClientFactory, Microsoft.Extensions.Configuration.IConfiguration configuration) : base(facade, facade.GetLogger<ShippingService>())
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<ApiResponse<List<ShippingEstimateResponseDto>>> EstimateShippingFeesAsync(ShippingEstimateRequestDto request)
        {
            try
            {
                var estimates = new List<ShippingEstimateResponseDto>();

                // 1. GHN Calculation
                var ghnConfig = _configuration.GetSection("GHN");
                string apiUrl = ghnConfig["ApiUrl"] ?? "https://dev-online-gateway.ghn.vn/shiip/public-api";
                string token = ghnConfig["Token"];
                string shopId = ghnConfig["ShopId"];
                int fromDistrictId = int.Parse(ghnConfig["FromDistrictId"] ?? "1454");
                string fromWardCode = ghnConfig["FromWardCode"] ?? "21211";

                if (!string.IsNullOrEmpty(token) && token != "YOUR_GHN_TOKEN_HERE" && request.ToDistrictId.HasValue && !string.IsNullOrEmpty(request.ToWardCode))
                {
                    try
                    {
                        var client = _httpClientFactory.CreateClient();
                        client.DefaultRequestHeaders.Add("Token", token);
                        client.DefaultRequestHeaders.Add("ShopId", shopId);

                        var payload = new
                        {
                            service_type_id = 2, // 2: E-commerce Delivery
                            insurance_value = (int)request.OrderTotalValue,
                            coupon = "",
                            from_district_id = fromDistrictId,
                            to_district_id = request.ToDistrictId.Value,
                            to_ward_code = request.ToWardCode,
                            weight = (int)request.WeightInGrams,
                            length = 15,
                            width = 15,
                            height = 15
                        };

                        var response = await client.PostAsJsonAsync($"{apiUrl}/v2/shipping-order/fee", payload);
                        
                        if (response.IsSuccessStatusCode)
                        {
                            var result = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
                            if (result.GetProperty("code").GetInt32() == 200)
                            {
                                var totalFee = result.GetProperty("data").GetProperty("total").GetDecimal();
                                estimates.Add(new ShippingEstimateResponseDto
                                {
                                    Provider = "Giao Hàng Nhanh (GHN)",
                                    EstimatedFee = totalFee,
                                    EstimatedDeliveryTime = "2-4 ngày làm việc"
                                });
                            }
                        }
                        else
                        {
                            var errResult = await response.Content.ReadAsStringAsync();
                            Logger.LogWarning($"GHN API Error: {errResult}");
                        }
                    }
                    catch (Exception ex)
                    {
                        Logger.LogError(ex, "Failed to call GHN API");
                    }
                }
                else
                {
                    // Fallback to Mock if Token is missing or request doesn't have district/ward ids
                    decimal ghnBaseFee = 30000;
                    if (request.Province.Contains("Hồ Chí Minh", StringComparison.OrdinalIgnoreCase) || 
                        request.Province.Contains("HCM", StringComparison.OrdinalIgnoreCase))
                    {
                        ghnBaseFee = 15000;
                    }
                    else if (request.Province.Contains("Hà Nội", StringComparison.OrdinalIgnoreCase))
                    {
                        ghnBaseFee = 35000;
                    }

                    estimates.Add(new ShippingEstimateResponseDto
                    {
                        Provider = "Giao Hàng Nhanh (GHN)",
                        EstimatedFee = ghnBaseFee + (request.WeightInGrams > 1000 ? 5000 : 0),
                        EstimatedDeliveryTime = "2-4 ngày làm việc (Mock)"
                    });
                }

                // 2. Distance-based calculation (OSRM)
                if (request.CustomerLat.HasValue && request.CustomerLng.HasValue)
                {
                    double shopLat = double.Parse(ghnConfig["ShopLat"] ?? "10.8512704");
                    double shopLng = double.Parse(ghnConfig["ShopLng"] ?? "106.6099654");
                    decimal baseFee = decimal.Parse(ghnConfig["BaseFee"] ?? "15000");
                    decimal feePerKm = decimal.Parse(ghnConfig["FeePerKm"] ?? "5000");

                    try
                    {
                        var client = _httpClientFactory.CreateClient();
                        var osrmUrl = $"http://router.project-osrm.org/route/v1/driving/{shopLng},{shopLat};{request.CustomerLng.Value},{request.CustomerLat.Value}?overview=false";
                        var response = await client.GetAsync(osrmUrl);
                        if (response.IsSuccessStatusCode)
                        {
                            var result = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
                            if (result.GetProperty("code").GetString() == "Ok")
                            {
                                var routes = result.GetProperty("routes");
                                if (routes.GetArrayLength() > 0)
                                {
                                    double distanceMeters = routes[0].GetProperty("distance").GetDouble();
                                    double distanceKm = distanceMeters / 1000.0;
                                    decimal totalFee = baseFee + (decimal)distanceKm * feePerKm;
                                    
                                    // Round to nearest 1000
                                    totalFee = Math.Ceiling(totalFee / 1000) * 1000;

                                    estimates.Add(new ShippingEstimateResponseDto
                                    {
                                        Provider = "Giao Hàng Siêu Tốc (Theo KM)",
                                        EstimatedFee = totalFee,
                                        EstimatedDeliveryTime = $"Khoảng cách: {distanceKm:F1} km"
                                    });
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Logger.LogError(ex, "Failed to calculate distance using OSRM");
                    }
                }
                else if (request.Province.Contains("Hồ Chí Minh", StringComparison.OrdinalIgnoreCase) || 
                    request.Province.Contains("HCM", StringComparison.OrdinalIgnoreCase) || 
                    request.Province.Contains("Hà Nội", StringComparison.OrdinalIgnoreCase))
                {
                    estimates.Add(new ShippingEstimateResponseDto
                    {
                        Provider = "Giao Hàng Siêu Tốc (Mock)",
                        EstimatedFee = 45000,
                        EstimatedDeliveryTime = "Trong ngày (1-2 giờ)"
                    });
                }

                return ApiResponse<List<ShippingEstimateResponseDto>>.SuccessResponse(estimates);
            }
            catch (Exception ex)
            {
                return LogAndReturnError<List<ShippingEstimateResponseDto>>("Failed to estimate shipping fees", ex);
            }
        }

        public async Task<ApiResponse<object>> GetProvincesAsync()
        {
            var ghnConfig = _configuration.GetSection("GHN");
            string token = ghnConfig["Token"];
            if (string.IsNullOrEmpty(token) || token == "YOUR_GHN_TOKEN_HERE")
            {
                return await GetMockProvincesAsync();
            }
            return await CallGhnApiAsync("/master-data/province");
        }

        public async Task<ApiResponse<object>> GetDistrictsAsync(int provinceId)
        {
            var ghnConfig = _configuration.GetSection("GHN");
            string token = ghnConfig["Token"];
            if (string.IsNullOrEmpty(token) || token == "YOUR_GHN_TOKEN_HERE")
            {
                return await GetMockDistrictsAsync(provinceId);
            }
            var payload = new { province_id = provinceId };
            return await CallGhnApiAsync("/master-data/district", payload);
        }

        public async Task<ApiResponse<object>> GetWardsAsync(int districtId)
        {
            var ghnConfig = _configuration.GetSection("GHN");
            string token = ghnConfig["Token"];
            if (string.IsNullOrEmpty(token) || token == "YOUR_GHN_TOKEN_HERE")
            {
                return await GetMockWardsAsync(districtId);
            }
            var payload = new { district_id = districtId };
            return await CallGhnApiAsync("/master-data/ward", payload);
        }

        // --- Mock Methods using provinces.open-api.vn ---
        private async Task<ApiResponse<object>> GetMockProvincesAsync()
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetAsync("https://provinces.open-api.vn/api/p/");
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
                    var mapped = new List<object>();
                    foreach (var item in data.EnumerateArray())
                    {
                        mapped.Add(new {
                            ProvinceID = item.GetProperty("code").GetInt32(),
                            ProvinceName = item.GetProperty("name").GetString()
                        });
                    }
                    return ApiResponse<object>.SuccessResponse(mapped);
                }
                return ApiResponse<object>.ErrorResponse("Mock API Error");
            }
            catch (Exception ex)
            {
                return LogAndReturnError<object>("Failed to get mock provinces", ex);
            }
        }

        private async Task<ApiResponse<object>> GetMockDistrictsAsync(int provinceId)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetAsync($"https://provinces.open-api.vn/api/p/{provinceId}?depth=2");
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
                    var mapped = new List<object>();
                    if (data.TryGetProperty("districts", out var districts))
                    {
                        foreach (var item in districts.EnumerateArray())
                        {
                            mapped.Add(new {
                                DistrictID = item.GetProperty("code").GetInt32(),
                                DistrictName = item.GetProperty("name").GetString()
                            });
                        }
                    }
                    return ApiResponse<object>.SuccessResponse(mapped);
                }
                return ApiResponse<object>.ErrorResponse("Mock API Error");
            }
            catch (Exception ex)
            {
                return LogAndReturnError<object>("Failed to get mock districts", ex);
            }
        }

        private async Task<ApiResponse<object>> GetMockWardsAsync(int districtId)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetAsync($"https://provinces.open-api.vn/api/d/{districtId}?depth=2");
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
                    var mapped = new List<object>();
                    if (data.TryGetProperty("wards", out var wards))
                    {
                        foreach (var item in wards.EnumerateArray())
                        {
                            mapped.Add(new {
                                WardCode = item.GetProperty("code").GetInt32().ToString(),
                                WardName = item.GetProperty("name").GetString()
                            });
                        }
                    }
                    return ApiResponse<object>.SuccessResponse(mapped);
                }
                return ApiResponse<object>.ErrorResponse("Mock API Error");
            }
            catch (Exception ex)
            {
                return LogAndReturnError<object>("Failed to get mock wards", ex);
            }
        }

        private async Task<ApiResponse<object>> CallGhnApiAsync(string endpoint, object? payload = null)
        {
            try
            {
                var ghnConfig = _configuration.GetSection("GHN");
                string apiUrl = ghnConfig["ApiUrl"] ?? "https://dev-online-gateway.ghn.vn/shiip/public-api";
                string token = ghnConfig["Token"];

                if (string.IsNullOrEmpty(token) || token == "YOUR_GHN_TOKEN_HERE")
                    return ApiResponse<object>.ErrorResponse("GHN Token is missing");

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("Token", token);

                HttpResponseMessage response;
                if (payload == null)
                {
                    response = await client.GetAsync($"{apiUrl}{endpoint}");
                }
                else
                {
                    response = await client.PostAsJsonAsync($"{apiUrl}{endpoint}", payload);
                }

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
                    if (result.GetProperty("code").GetInt32() == 200)
                    {
                        var data = result.GetProperty("data");
                        return ApiResponse<object>.SuccessResponse(data);
                    }
                    return ApiResponse<object>.ErrorResponse("GHN API Error: " + result.GetProperty("message").GetString());
                }
                
                var errResult = await response.Content.ReadAsStringAsync();
                Logger.LogWarning($"GHN API Error: {errResult}");
                return ApiResponse<object>.ErrorResponse("Failed to fetch data from GHN API");
            }
            catch (Exception ex)
            {
                return LogAndReturnError<object>($"Failed to call GHN API {endpoint}", ex);
            }
        }
    }
}
