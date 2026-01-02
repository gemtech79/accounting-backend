using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AccountingBackend.Models
{
    [Table("journal_entry_lines")]
    public class JournalEntryLine
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("journal_entry_id")]
        public Guid JournalEntryId { get; set; }

        [Required]
        [Column("account_id")]
        public Guid AccountId { get; set; }

        [Column("debit_amount")]
        [Range(0, double.MaxValue)]
        public decimal DebitAmount { get; set; } = 0.00m;

        [Column("credit_amount")]
        [Range(0, double.MaxValue)]
        public decimal CreditAmount { get; set; } = 0.00m;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("JournalEntryId")]
        public JournalEntry JournalEntry { get; set; }

        [ForeignKey("AccountId")]
        public ChartOfAccount Account { get; set; }

        // Custom validation for the check constraint
        public bool IsValid()
        {
            return (DebitAmount > 0 && CreditAmount == 0) || (DebitAmount == 0 && CreditAmount > 0);
        }
    }
}