using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AccountingBackend.Data;
using AccountingBackend.Models;

namespace AccountingBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChartOfAccountsController : ControllerBase
    {
        private readonly AccountingDbContext _context;

        public ChartOfAccountsController(AccountingDbContext context)
        {
            _context = context;
        }

        // GET: api/ChartOfAccounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChartOfAccount>>> GetChartOfAccounts()
        {
            return await _context.ChartOfAccounts.Include(coa => coa.Tenant).ToListAsync();
        }

        // GET: api/ChartOfAccounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChartOfAccount>> GetChartOfAccount(Guid id)
        {
            var chartOfAccount = await _context.ChartOfAccounts.Include(coa => coa.Tenant).FirstOrDefaultAsync(coa => coa.Id == id);

            if (chartOfAccount == null)
            {
                return NotFound();
            }

            return chartOfAccount;
        }

        // PUT: api/ChartOfAccounts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChartOfAccount(Guid id, ChartOfAccount chartOfAccount)
        {
            if (id != chartOfAccount.Id)
            {
                return BadRequest();
            }

            _context.Entry(chartOfAccount).State = EntityState.Modified;

            try
            {
                chartOfAccount.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChartOfAccountExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ChartOfAccounts
        [HttpPost]
        public async Task<ActionResult<ChartOfAccount>> PostChartOfAccount(ChartOfAccount chartOfAccount)
        {
            _context.ChartOfAccounts.Add(chartOfAccount);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChartOfAccount", new { id = chartOfAccount.Id }, chartOfAccount);
        }

        // DELETE: api/ChartOfAccounts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChartOfAccount(Guid id)
        {
            var chartOfAccount = await _context.ChartOfAccounts.FindAsync(id);
            if (chartOfAccount == null)
            {
                return NotFound();
            }

            _context.ChartOfAccounts.Remove(chartOfAccount);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ChartOfAccountExists(Guid id)
        {
            return _context.ChartOfAccounts.Any(e => e.Id == id);
        }
    }
}