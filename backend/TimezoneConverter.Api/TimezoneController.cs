using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace TimezoneConverter.Api.Controllers;

[ApiController]
[Route("[controller]")]  // Remove api prefix since it's now handled by subdomain
public class TimezoneController : ControllerBase
{
    private readonly ILogger<TimezoneController> _logger;

    public TimezoneController(ILogger<TimezoneController> logger)
    {
        _logger = logger;
    }

    [HttpGet("list")]  // This makes it /timezone/list
    public IActionResult GetTimezones()
    {
        _logger.LogInformation("GetTimezones called at path: {Path}, base path: {BasePath}",
            Request.Path,
            Request.PathBase);

        _logger.LogDebug(
            "GetTimezones endpoint hit:\n" +
            "Route Template: {RouteTemplate}\n" +
            "Request Path: {Path}\n" +
            "Request PathBase: {PathBase}",
            ControllerContext.ActionDescriptor.AttributeRouteInfo?.Template,
            Request.Path,
            Request.PathBase
        );

        _logger.LogInformation("GetTimezones called. Request path: {Path}", Request.Path);
        _logger.LogInformation("Request headers: {@Headers}", Request.Headers);

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

            _logger.LogInformation("Retrieved {Count} timezones", timezones.Count);

            return Ok(timezones);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting timezones");
            return StatusCode(500, new { error = ex.Message, stack = ex.StackTrace });
        }
    }

    [HttpGet("convert")]
    public IActionResult ConvertTime(string fromTimezone, string toTimezone, DateTime dateTime)
    {
        try
        {
            TimeZoneInfo fromTz = TimeZoneInfo.FindSystemTimeZoneById(fromTimezone);
            TimeZoneInfo toTz = TimeZoneInfo.FindSystemTimeZoneById(toTimezone);

            // Create a DateTimeOffset using the source timezone's offset at the given time
            var sourceOffset = fromTz.GetUtcOffset(dateTime);
            var sourceTimeOffset = new DateTimeOffset(dateTime, sourceOffset);

            // Convert to the target timezone
            var targetTime = TimeZoneInfo.ConvertTime(sourceTimeOffset, toTz);
            var utcTime = targetTime.ToUniversalTime();

            _logger.LogInformation($"Converting {dateTime} from {fromTimezone} to {toTimezone}");

            return Ok(new
            {
                InputTime = sourceTimeOffset.ToString("o"),
                InputTimezone = fromTz.Id,
                OutputTime = targetTime.ToString("o"),
                OutputTimezone = toTz.Id,
                UtcTime = utcTime.ToString("o")
            });
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
