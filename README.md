# Accounting Backend

This is an ASP.NET Core Web API project for managing accounting data including tenants, chart of accounts, journal entries, and journal entry lines.

## Prerequisites

- .NET 10.0 SDK
- PostgreSQL database (hosted on Google Cloud SQL)

## Database Setup

The database tables are created using the following SQL scripts:

- `tenants`
- `chart_of_accounts`
- `journal_entries`
- `journal_entry_lines`

Ensure your PostgreSQL database has these tables created.

## Configuration

Update the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=34.63.187.132;Database=accounting-db;Username=your-username;Password=your-password;SSL Mode=Disable"
  }
}
```

Replace `your-username` and `your-password` with your actual database credentials.

## Running the Application

1. Restore dependencies:
   ```bash
   dotnet restore
   ```

2. Build the project:
   ```bash
   dotnet build
   ```

3. Run the application:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001` (or similar).

## API Endpoints

- `GET /api/Tenants` - Get all tenants
- `POST /api/Tenants` - Create a new tenant
- `GET /api/Tenants/{id}` - Get a specific tenant
- `PUT /api/Tenants/{id}` - Update a tenant
- `DELETE /api/Tenants/{id}` - Delete a tenant

- `GET /api/ChartOfAccounts` - Get all chart of accounts
- `POST /api/ChartOfAccounts` - Create a new chart of account
- `GET /api/ChartOfAccounts/{id}` - Get a specific chart of account
- `PUT /api/ChartOfAccounts/{id}` - Update a chart of account
- `DELETE /api/ChartOfAccounts/{id}` - Delete a chart of account

- `GET /api/JournalEntries` - Get all journal entries
- `POST /api/JournalEntries` - Create a new journal entry
- `GET /api/JournalEntries/{id}` - Get a specific journal entry
- `PUT /api/JournalEntries/{id}` - Update a journal entry
- `DELETE /api/JournalEntries/{id}` - Delete a journal entry

- `GET /api/JournalEntryLines` - Get all journal entry lines
- `POST /api/JournalEntryLines` - Create a new journal entry line
- `GET /api/JournalEntryLines/{id}` - Get a specific journal entry line
- `PUT /api/JournalEntryLines/{id}` - Update a journal entry line
- `DELETE /api/JournalEntryLines/{id}` - Delete a journal entry line

## Notes

- Journal entry lines enforce that either debit or credit amount is positive, but not both.
- Foreign key constraints ensure data integrity.