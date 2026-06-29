using WatchStore.Application.Common;
using WatchStore.Application.DTOs;

namespace WatchStore.Application.Interfaces
{
    public interface IUserAddressService
    {
        Task<ApiResponse<List<UserAddressDto>>> GetUserAddressesAsync(int userId);
        Task<ApiResponse<UserAddressDto>> GetUserAddressByIdAsync(int userId, int addressId);
        Task<ApiResponse<UserAddressDto>> CreateUserAddressAsync(int userId, CreateUserAddressDto dto);
        Task<ApiResponse<UserAddressDto>> UpdateUserAddressAsync(int userId, int addressId, UpdateUserAddressDto dto);
        Task<ApiResponse<bool>> DeleteUserAddressAsync(int userId, int addressId);
        Task<ApiResponse<bool>> SetDefaultAddressAsync(int userId, int addressId);
    }
}
