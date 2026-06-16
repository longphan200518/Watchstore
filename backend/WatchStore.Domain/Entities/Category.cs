using System.Collections.Generic;

namespace WatchStore.Domain.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Navigation property
        public virtual ICollection<Watch> Watches { get; set; } = new List<Watch>();
    }
}
