using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TimezoneConverter.Api.Data;
using TimezoneConverter.Api.Data.Repositories;
using TimezoneConverter.Api.Models;

namespace TimezoneConverter.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly EventRepository _eventRepository;
        private readonly ILogger<EventsController> _logger;

        public EventsController(EventRepository eventRepository, ILogger<EventsController> logger)
        {
            _eventRepository = eventRepository;
            _logger = logger;
        }

        // GET: /events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            _logger.LogInformation("Getting all events");
            return await _eventRepository.GetAllEventsAsync();
        }

        // GET: /events/5
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Event>> GetEvent(Guid id)
        {
            _logger.LogInformation("Getting event with ID: {EventId}", id);
            var eventItem = await _eventRepository.GetEventByIdAsync(id);

            if (eventItem == null)
            {
                return NotFound();
            }

            return eventItem;
        }
        
        // GET: /events/share/{uuid}
        [HttpGet("share/{uuid}")]
        public async Task<ActionResult<Event>> GetEventByShareableId(string uuid)
        {
            _logger.LogInformation("Getting event with shareable ID: {ShareableId}", uuid);
            var eventItem = await _eventRepository.GetEventByUuidAsync(uuid);

            if (eventItem == null)
            {
                return NotFound();
            }

            return eventItem;
        }

        // POST: /events
        [HttpPost]
        public async Task<ActionResult<Event>> CreateEvent(Event eventItem)
        {
            _logger.LogInformation("Creating new event: {Title}", eventItem.Title);
            
            // Ensure a unique shareable ID is set
            if (string.IsNullOrEmpty(eventItem.ShareableId))
            {
                eventItem.ShareableId = Guid.NewGuid().ToString();
            }
            
            await _eventRepository.AddEventAsync(eventItem);

            return CreatedAtAction(
                nameof(GetEventByShareableId), 
                new { uuid = eventItem.ShareableId }, 
                eventItem
            );
        }
    }
}
