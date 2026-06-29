namespace WatchStore.Application.DTOs
{
    public class ShippingEstimateRequestDto
    {
        public string Province { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Ward { get; set; } = string.Empty;
        public int? ToDistrictId { get; set; }
        public string? ToWardCode { get; set; }
        public decimal WeightInGrams { get; set; } = 500;
        public decimal OrderTotalValue { get; set; } = 0;
        public double? CustomerLat { get; set; }
        public double? CustomerLng { get; set; }
    }

    public class ShippingEstimateResponseDto
    {
        public string Provider { get; set; } = string.Empty; // GHN, Grab
        public decimal EstimatedFee { get; set; }
        public string EstimatedDeliveryTime { get; set; } = string.Empty;
    }
}
