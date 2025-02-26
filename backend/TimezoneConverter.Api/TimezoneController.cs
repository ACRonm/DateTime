using Microsoft.AspNetCore.Mvc;

namespace TimezoneConverter.Api.Controllers;

[ApiController]
[Route("api/timezone")]
public class TimezoneController : ControllerBase
{
    private readonly ILogger<TimezoneController> _logger;

    public TimezoneController(ILogger<TimezoneController> logger)
    {
        _logger = logger;
    }

    [HttpGet("list")]
    public IActionResult GetTimezones()
    {
        try
        {
            var timezones = TimeZoneInfo.GetSystemTimeZones()
                .Select(tz => new
                {
                    Id = tz.Id,
                    DisplayName = $"{tz.Id} ({tz.BaseUtcOffset:hh\\:mm})"
                })
                .OrderBy(tz => tz.DisplayName)
                .ToList();

            _logger.LogInformation($"Retrieved {timezones.Count} timezones");
            return Ok(timezones);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting timezones");
            return StatusCode(500, "Error getting timezones");
        }
    }

    [HttpGet("convert")]
    public IActionResult ConvertTime(string fromTimezone, string toTimezone, DateTime dateTime)
    {
        try
        {
            TimeZoneInfo fromTz = TimeZoneInfo.FindSystemTimeZoneById(fromTimezone);
            TimeZoneInfo toTz = TimeZoneInfo.FindSystemTimeZoneById(toTimezone);

            // Ensure the datetime kind is UTC if the from timezone is UTC
            if (fromTz.Id == "UTC" && dateTime.Kind != DateTimeKind.Utc)
                dateTime = DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);

            DateTime convertedTime = TimeZoneInfo.ConvertTime(dateTime, fromTz, toTz);

            return Ok(new { ConvertedTime = convertedTime });
        }
        catch (TimeZoneNotFoundException)
        {
            return BadRequest("Invalid timezone ID.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error converting time");
            return StatusCode(500, "Error converting time");
        }
    }
}
