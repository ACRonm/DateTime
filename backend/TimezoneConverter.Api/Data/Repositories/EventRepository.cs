using Microsoft.EntityFrameworkCore;
using TimezoneConverter.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TimezoneConverter.Api.Data.Repositories
{
    public class EventRepository
    {
        private readonly AppDbContext _dbContext;

        public EventRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Event>> GetAllEventsAsync()
        {
            return await _dbContext.Events
                .Include(e => e.User)
                .ToListAsync();
        }

        public async Task<Event?> GetEventByIdAsync(Guid id)
        {
            return await _dbContext.Events
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Event?> GetEventByUuidAsync(string uuid)
        {
            return await _dbContext.Events
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.ShareableId == uuid);
        }

        public async Task AddEventAsync(Event eventEntity)
        {
            await _dbContext.Events.AddAsync(eventEntity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateEventAsync(Event eventEntity)
        {
            _dbContext.Events.Update(eventEntity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteEventAsync(Guid id)
        {
            var eventToDelete = await _dbContext.Events.FindAsync(id);
            if (eventToDelete != null)
            {
                _dbContext.Events.Remove(eventToDelete);
                await _dbContext.SaveChangesAsync();
            }
        }
        
        // Additional repository methods
    }
}
