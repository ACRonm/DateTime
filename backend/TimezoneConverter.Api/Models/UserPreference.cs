using System;

namespace TimezoneConverter.Api.Models
{
    public class UserPreference
    {
        public Guid UserId { get; set; }
        public string DefaultTimezone { get; set; } = "UTC";
        public string DateFormat { get; set; } = "MM/DD/YYYY";
        public string TimeFormat { get; set; } = "hh:mm A";
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public User? User { get; set; }
    }
}
