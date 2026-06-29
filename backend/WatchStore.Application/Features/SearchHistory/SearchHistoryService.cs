using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WatchStore.Application.Common;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;
using WatchStore.Domain.Interfaces;

namespace WatchStore.Application.Features.SearchHistory
{
    public class SearchHistoryService : BaseService, ISearchHistoryService
    {
        private readonly IRepository<Domain.Entities.SearchHistory> _repository;

        public SearchHistoryService(IServiceFacade facade)
            : base(facade, facade.GetLogger<SearchHistoryService>())
        {
            _repository = facade.UnitOfWork.GetRepository<Domain.Entities.SearchHistory>();
        }

        public async Task LogSearchAsync(int userId, string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm)) return;

            try
            {
                var term = searchTerm.Trim();

                var existing = await _repository.GetQueryable()
                    .Where(sh => sh.UserId == userId && sh.SearchTerm == term)
                    .FirstOrDefaultAsync();

                if (existing != null)
                {
                    existing.CreatedAt = DateTime.UtcNow;
                    await _repository.UpdateAsync(existing);
                }
                else
                {
                    var newHistory = new Domain.Entities.SearchHistory
                    {
                        UserId = userId,
                        SearchTerm = term
                    };
                    await _repository.AddAsync(newHistory);
                }

                await Facade.UnitOfWork.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Failed to log search history for user {UserId}", userId);
            }
        }

        public async Task<ApiResponse<List<SearchHistoryDto>>> GetUserSearchHistoryAsync(int userId, int limit = 10)
        {
            try
            {
                var history = await _repository.GetQueryable()
                    .Where(sh => sh.UserId == userId)
                    .OrderByDescending(sh => sh.CreatedAt)
                    .Take(limit)
                    .Select(sh => new SearchHistoryDto
                    {
                        Id = sh.Id,
                        SearchTerm = sh.SearchTerm,
                        CreatedAt = sh.CreatedAt
                    })
                    .ToListAsync();

                return ApiResponse<List<SearchHistoryDto>>.SuccessResponse(history);
            }
            catch (Exception ex)
            {
                return LogAndReturnError<List<SearchHistoryDto>>("Failed to get search history", ex);
            }
        }

        public async Task<ApiResponse<bool>> ClearUserSearchHistoryAsync(int userId)
        {
            try
            {
                var history = await _repository.GetQueryable()
                    .Where(sh => sh.UserId == userId)
                    .ToListAsync();

                foreach (var item in history)
                {
                    await _repository.DeleteAsync(item);
                }

                await Facade.UnitOfWork.SaveChangesAsync();
                return ApiResponse<bool>.SuccessResponse(true);
            }
            catch (Exception ex)
            {
                return LogAndReturnError<bool>("Failed to clear search history", ex);
            }
        }
    }
}
