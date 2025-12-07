using System.Linq.Expressions;
using WatchStore.Domain.Entities;
using WatchStore.Domain.Enums;
using WatchStore.Domain.Specifications;

namespace WatchStore.Application.Specifications
{
    /// <summary>
    /// Specification for filtering watches
    /// </summary>
    public class WatchWithFiltersSpecification : BaseSpecification<Watch>
    {
        public WatchWithFiltersSpecification(
            string? searchTerm = null,
            int? brandId = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            WatchStatus? status = null,
            string? sortBy = null,
            bool isDescending = false,
            int? pageNumber = null,
            int? pageSize = null) : base(BuildCriteria(searchTerm, brandId, minPrice, maxPrice, status))
        {
            // Add includes
            AddInclude(w => w.Brand);
            AddInclude(w => w.Seller!);
            AddInclude(w => w.Images);

            // Apply sorting
            switch (sortBy?.ToLower())
            {
                case "name":
                    if (isDescending)
                        ApplyOrderByDescending(w => w.Name);
                    else
                        ApplyOrderBy(w => w.Name);
                    break;
                case "price":
                    if (isDescending)
                        ApplyOrderByDescending(w => w.Price);
                    else
                        ApplyOrderBy(w => w.Price);
                    break;
                default:
                    if (isDescending)
                        ApplyOrderByDescending(w => w.CreatedAt);
                    else
                        ApplyOrderBy(w => w.CreatedAt);
                    break;
            }

            // Apply paging
            if (pageNumber.HasValue && pageSize.HasValue)
            {
                ApplyPaging((pageNumber.Value - 1) * pageSize.Value, pageSize.Value);
            }
        }

        private static Expression<Func<Watch, bool>>? BuildCriteria(
            string? searchTerm,
            int? brandId,
            decimal? minPrice,
            decimal? maxPrice,
            WatchStatus? status)
        {
            Expression<Func<Watch, bool>>? criteria = null;

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowerSearchTerm = searchTerm.ToLower();
                criteria = w => w.Name.ToLower().Contains(lowerSearchTerm) ||
                               (w.Description != null && w.Description.ToLower().Contains(lowerSearchTerm));
            }

            if (brandId.HasValue)
            {
                if (criteria == null)
                    criteria = w => w.BrandId == brandId.Value;
                else
                    criteria = CombineAnd(criteria, w => w.BrandId == brandId.Value);
            }

            if (minPrice.HasValue)
            {
                if (criteria == null)
                    criteria = w => w.Price >= minPrice.Value;
                else
                    criteria = CombineAnd(criteria, w => w.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                if (criteria == null)
                    criteria = w => w.Price <= maxPrice.Value;
                else
                    criteria = CombineAnd(criteria, w => w.Price <= maxPrice.Value);
            }

            if (status.HasValue)
            {
                if (criteria == null)
                    criteria = w => w.Status == status.Value;
                else
                    criteria = CombineAnd(criteria, w => w.Status == status.Value);
            }

            return criteria;
        }

        private static Expression<Func<T, bool>> CombineAnd<T>(
            Expression<Func<T, bool>> left,
            Expression<Func<T, bool>> right)
        {
            var parameter = Expression.Parameter(typeof(T));
            var leftVisitor = new ReplaceExpressionVisitor(left.Parameters[0], parameter);
            var leftBody = leftVisitor.Visit(left.Body);
            var rightVisitor = new ReplaceExpressionVisitor(right.Parameters[0], parameter);
            var rightBody = rightVisitor.Visit(right.Body);
            return Expression.Lambda<Func<T, bool>>(
                Expression.AndAlso(leftBody!, rightBody!), parameter);
        }

        private class ReplaceExpressionVisitor : ExpressionVisitor
        {
            private readonly Expression _oldValue;
            private readonly Expression _newValue;

            public ReplaceExpressionVisitor(Expression oldValue, Expression newValue)
            {
                _oldValue = oldValue;
                _newValue = newValue;
            }

            public override Expression? Visit(Expression? node)
            {
                return node == _oldValue ? _newValue : base.Visit(node);
            }
        }
    }

    /// <summary>
    /// Specification to get watch by ID with all related data
    /// </summary>
    public class WatchByIdSpecification : BaseSpecification<Watch>
    {
        public WatchByIdSpecification(int watchId) : base(w => w.Id == watchId)
        {
            AddInclude(w => w.Brand);
            AddInclude(w => w.Seller!);
            AddInclude(w => w.Images);
        }
    }

    /// <summary>
    /// Specification to get available watches only
    /// </summary>
    public class AvailableWatchesSpecification : BaseSpecification<Watch>
    {
        public AvailableWatchesSpecification() : base(w => w.Status == WatchStatus.Available && w.StockQuantity > 0)
        {
            AddInclude(w => w.Brand);
            AddInclude(w => w.Images);
            ApplyOrderByDescending(w => w.CreatedAt);
        }
    }
}
