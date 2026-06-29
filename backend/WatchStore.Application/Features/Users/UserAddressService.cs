using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.Users
{
    public class UserAddressService : BaseService, IUserAddressService
    {
        private readonly IRepository<UserAddress> _addressRepository;

        public UserAddressService(IServiceFacade facade) 
            : base(facade, facade.GetLogger<UserAddressService>())
        {
            _addressRepository = facade.UnitOfWork.GetRepository<UserAddress>();
        }

        public async Task<ApiResponse<List<UserAddressDto>>> GetUserAddressesAsync(int userId)
        {
            try
            {
                var addresses = await _addressRepository.GetQueryable()
                    .Where(a => a.UserId == userId)
                    .OrderByDescending(a => a.IsDefault)
                    .ThenByDescending(a => a.CreatedAt)
                    .ToListAsync();

                var dtos = addresses.Select(MapToDto).ToList();
                return ApiResponse<List<UserAddressDto>>.SuccessResponse(dtos);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error getting addresses for user {UserId}", userId);
                return ApiResponse<List<UserAddressDto>>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserAddressDto>> GetUserAddressByIdAsync(int userId, int addressId)
        {
            try
            {
                var address = await _addressRepository.GetQueryable()
                    .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

                if (address == null)
                {
                    return ApiResponse<UserAddressDto>.ErrorResponse("Địa chỉ không tồn tại");
                }

                return ApiResponse<UserAddressDto>.SuccessResponse(MapToDto(address));
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error getting address {AddressId} for user {UserId}", addressId, userId);
                return ApiResponse<UserAddressDto>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserAddressDto>> CreateUserAddressAsync(int userId, CreateUserAddressDto dto)
        {
            try
            {
                // Check if this is the first address, if so make it default
                var hasAddresses = await _addressRepository.GetQueryable()
                    .AnyAsync(a => a.UserId == userId);

                var isDefault = dto.IsDefault || !hasAddresses;

                if (isDefault && hasAddresses)
                {
                    // Remove default from other addresses
                    var oldDefaults = await _addressRepository.GetQueryable()
                        .Where(a => a.UserId == userId && a.IsDefault)
                        .ToListAsync();

                    foreach (var oldDefault in oldDefaults)
                    {
                        oldDefault.IsDefault = false;
                        await _addressRepository.UpdateAsync(oldDefault);
                    }
                }

                var address = new UserAddress
                {
                    UserId = userId,
                    FullName = dto.FullName,
                    PhoneNumber = dto.PhoneNumber,
                    Province = dto.Province,
                    District = dto.District,
                    Ward = dto.Ward,
                    StreetAddress = dto.StreetAddress,
                    IsDefault = isDefault
                };

                await _addressRepository.AddAsync(address);
                await Facade.UnitOfWork.SaveChangesAsync();

                return ApiResponse<UserAddressDto>.SuccessResponse(MapToDto(address), "Thêm địa chỉ thành công");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error creating address for user {UserId}", userId);
                return ApiResponse<UserAddressDto>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserAddressDto>> UpdateUserAddressAsync(int userId, int addressId, UpdateUserAddressDto dto)
        {
            try
            {
                var address = await _addressRepository.GetQueryable()
                    .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

                if (address == null)
                {
                    return ApiResponse<UserAddressDto>.ErrorResponse("Địa chỉ không tồn tại");
                }

                if (dto.IsDefault && !address.IsDefault)
                {
                    // Remove default from other addresses
                    var oldDefaults = await _addressRepository.GetQueryable()
                        .Where(a => a.UserId == userId && a.IsDefault)
                        .ToListAsync();

                    foreach (var oldDefault in oldDefaults)
                    {
                        oldDefault.IsDefault = false;
                        await _addressRepository.UpdateAsync(oldDefault);
                    }
                }

                address.FullName = dto.FullName;
                address.PhoneNumber = dto.PhoneNumber;
                address.Province = dto.Province;
                address.District = dto.District;
                address.Ward = dto.Ward;
                address.StreetAddress = dto.StreetAddress;
                address.IsDefault = dto.IsDefault || address.IsDefault; // Keep true if it was already true

                await _addressRepository.UpdateAsync(address);
                await Facade.UnitOfWork.SaveChangesAsync();

                return ApiResponse<UserAddressDto>.SuccessResponse(MapToDto(address), "Cập nhật địa chỉ thành công");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error updating address {AddressId} for user {UserId}", addressId, userId);
                return ApiResponse<UserAddressDto>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteUserAddressAsync(int userId, int addressId)
        {
            try
            {
                var address = await _addressRepository.GetQueryable()
                    .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

                if (address == null)
                {
                    return ApiResponse<bool>.ErrorResponse("Địa chỉ không tồn tại");
                }

                await _addressRepository.DeleteAsync(address);

                // If we deleted the default address, make the most recently created one default
                if (address.IsDefault)
                {
                    var newestAddress = await _addressRepository.GetQueryable()
                        .Where(a => a.UserId == userId && a.Id != addressId)
                        .OrderByDescending(a => a.CreatedAt)
                        .FirstOrDefaultAsync();

                    if (newestAddress != null)
                    {
                        newestAddress.IsDefault = true;
                        await _addressRepository.UpdateAsync(newestAddress);
                    }
                }

                await Facade.UnitOfWork.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResponse(true, "Xóa địa chỉ thành công");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error deleting address {AddressId} for user {UserId}", addressId, userId);
                return ApiResponse<bool>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> SetDefaultAddressAsync(int userId, int addressId)
        {
            try
            {
                var address = await _addressRepository.GetQueryable()
                    .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

                if (address == null)
                {
                    return ApiResponse<bool>.ErrorResponse("Địa chỉ không tồn tại");
                }

                if (address.IsDefault)
                {
                    return ApiResponse<bool>.SuccessResponse(true); // Already default
                }

                // Remove default from other addresses
                var oldDefaults = await _addressRepository.GetQueryable()
                    .Where(a => a.UserId == userId && a.IsDefault)
                    .ToListAsync();

                foreach (var oldDefault in oldDefaults)
                {
                    oldDefault.IsDefault = false;
                    await _addressRepository.UpdateAsync(oldDefault);
                }

                address.IsDefault = true;
                await _addressRepository.UpdateAsync(address);
                
                await Facade.UnitOfWork.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResponse(true, "Đã đặt làm địa chỉ mặc định");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error setting default address {AddressId} for user {UserId}", addressId, userId);
                return ApiResponse<bool>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        private UserAddressDto MapToDto(UserAddress address)
        {
            return new UserAddressDto
            {
                Id = address.Id,
                UserId = address.UserId,
                FullName = address.FullName,
                PhoneNumber = address.PhoneNumber,
                Province = address.Province,
                District = address.District,
                Ward = address.Ward,
                StreetAddress = address.StreetAddress,
                IsDefault = address.IsDefault
            };
        }
    }
}
