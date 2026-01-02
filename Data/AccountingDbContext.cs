using Microsoft.EntityFrameworkCore;
using AccountingBackend.Models;

namespace AccountingBackend.Data
{
    public class AccountingDbContext : DbContext
    {
        public AccountingDbContext(DbContextOptions<AccountingDbContext> options)
            : base(options)
        {
        }

        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<ChartOfAccount> ChartOfAccounts { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<JournalEntryLine> JournalEntryLines { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Tenant
            modelBuilder.Entity<Tenant>()
                .HasIndex(t => t.Name)
                .IsUnique();

            // Configure ChartOfAccount
            modelBuilder.Entity<ChartOfAccount>()
                .HasOne(coa => coa.Tenant)
                .WithMany(t => t.ChartOfAccounts)
                .HasForeignKey(coa => coa.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChartOfAccount>()
                .HasIndex(coa => new { coa.TenantId, coa.AccountName })
                .IsUnique();

            modelBuilder.Entity<ChartOfAccount>()
                .HasIndex(coa => coa.AccountCode)
                .IsUnique();

            // Configure JournalEntry
            modelBuilder.Entity<JournalEntry>()
                .HasOne(je => je.Tenant)
                .WithMany(t => t.JournalEntries)
                .HasForeignKey(je => je.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure JournalEntryLine
            modelBuilder.Entity<JournalEntryLine>()
                .HasOne(jel => jel.JournalEntry)
                .WithMany(je => je.JournalEntryLines)
                .HasForeignKey(jel => jel.JournalEntryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JournalEntryLine>()
                .HasOne(jel => jel.Account)
                .WithMany(coa => coa.JournalEntryLines)
                .HasForeignKey(jel => jel.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            // Custom check constraint for JournalEntryLine
            modelBuilder.Entity<JournalEntryLine>()
                .ToTable(t => t.HasCheckConstraint("CK_JournalEntryLine_Amounts",
                    "(debit_amount > 0 AND credit_amount = 0) OR (debit_amount = 0 AND credit_amount > 0)"));
        }
    }
}