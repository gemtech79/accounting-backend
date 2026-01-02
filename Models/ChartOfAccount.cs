using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AccountingBackend.Models
{
    [Table("chart_of_accounts")]
    public class ChartOfAccount
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("tenant_id")]
        public Guid TenantId { get; set; }

        [Required]
        [Column("account_name")]
        [StringLength(255)]
        public string AccountName { get; set; }

        [Required]
        [Column("account_type")]
        [StringLength(50)]
        public string AccountType { get; set; } // e.g., 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'

        [Column("account_code")]
        [StringLength(20)]
        public string? AccountCode { get; set; } // Optional

        [Column("description")]
        public string? Description { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("TenantId")]
        public Tenant Tenant { get; set; }

        public ICollection<JournalEntryLine> JournalEntryLines { get; set; } = new List<JournalEntryLine>();
    }
}