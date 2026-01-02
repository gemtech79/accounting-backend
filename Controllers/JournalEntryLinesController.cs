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
    public class JournalEntryLinesController : ControllerBase
    {
        private readonly AccountingDbContext _context;

        public JournalEntryLinesController(AccountingDbContext context)
        {
            _context = context;
        }

        // GET: api/JournalEntryLines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JournalEntryLine>>> GetJournalEntryLines()
        {
            return await _context.JournalEntryLines.Include(jel => jel.JournalEntry).Include(jel => jel.Account).ToListAsync();
        }

        // GET: api/JournalEntryLines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<JournalEntryLine>> GetJournalEntryLine(Guid id)
        {
            var journalEntryLine = await _context.JournalEntryLines
                .Include(jel => jel.JournalEntry)
                .Include(jel => jel.Account)
                .FirstOrDefaultAsync(jel => jel.Id == id);

            if (journalEntryLine == null)
            {
                return NotFound();
            }

            return journalEntryLine;
        }

        // PUT: api/JournalEntryLines/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJournalEntryLine(Guid id, JournalEntryLine journalEntryLine)
        {
            if (id != journalEntryLine.Id)
            {
                return BadRequest();
            }

            if (!journalEntryLine.IsValid())
            {
                return BadRequest("Either debit or credit amount must be greater than 0, but not both.");
            }

            _context.Entry(journalEntryLine).State = EntityState.Modified;

            try
            {
                journalEntryLine.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JournalEntryLineExists(id))
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

        // POST: api/JournalEntryLines
        [HttpPost]
        public async Task<ActionResult<JournalEntryLine>> PostJournalEntryLine(JournalEntryLine journalEntryLine)
        {
            if (!journalEntryLine.IsValid())
            {
                return BadRequest("Either debit or credit amount must be greater than 0, but not both.");
            }

            _context.JournalEntryLines.Add(journalEntryLine);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetJournalEntryLine", new { id = journalEntryLine.Id }, journalEntryLine);
        }

        // DELETE: api/JournalEntryLines/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJournalEntryLine(Guid id)
        {
            var journalEntryLine = await _context.JournalEntryLines.FindAsync(id);
            if (journalEntryLine == null)
            {
                return NotFound();
            }

            _context.JournalEntryLines.Remove(journalEntryLine);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool JournalEntryLineExists(Guid id)
        {
            return _context.JournalEntryLines.Any(e => e.Id == id);
        }
    }
}