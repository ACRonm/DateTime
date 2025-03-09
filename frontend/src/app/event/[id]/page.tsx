"use client";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api-config";
import { useParams } from "next/navigation";
import { Meteors } from "@stianlarsen/meteors";
import { CalendarDays, Clock, Globe, Share2 } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  timezone: string;
}

export default function EventPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLocalTime, setUserLocalTime] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Initially try to fetch from localStorage for immediate display if available
    if (typeof window !== "undefined") {
      const storedEvents = JSON.parse(localStorage.getItem("events") || "{}");
      if (storedEvents[id]) {
        // Format the event data to match our interface
        const localEvent = {
          id: storedEvents[id].id,
          title: storedEvents[id].name,
          startTime: `${storedEvents[id].date}T${storedEvents[id].time}`,
          timezone: storedEvents[id].timezone,
        };
        setEvent(localEvent);
        convertToLocalTime(localEvent);
      }
    }
    
    // Try to fetch from API through the Next.js API route proxy
    const fetchEvent = async () => {
      try {
          // Use getApiUrl helper to target external API
          const response = await fetch(getApiUrl(`/api/events/share/${id}`));
        if (!response.ok) {
          throw new Error(`Event not found (${response.status})`);
        }
        const data = await response.json();
        setEvent(data);
        convertToLocalTime(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        if (!event) { // Only set error if we didn't get data from localStorage
          setError("Failed to load event. It may have been deleted or doesn't exist.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const convertToLocalTime = (eventData: Event) => {
    if (!eventData?.startTime) return;
    
    try {
      // Convert event time to user's local timezone
      const eventTime = new Date(eventData.startTime);
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Format the date in the user's locale and timezone
      const formatter = new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
        timeZone: userTimezone
      });
      
      setUserLocalTime(formatter.format(eventTime));
    } catch (err) {
      console.error("Error converting time:", err);
      setUserLocalTime("Error converting time");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title || "Shared Event",
          text: `Check out this event: ${event?.title}`,
          url: window.location.href
        });
      } catch (err) {
        console.log("Error sharing:", err);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 relative">
        <Meteors />
            <div className="w-full max-w-3xl">
                <div className="animate-pulse w-full rounded-lg border-2 bg-card/60 backdrop-blur-sm p-6 shadow-lg min-h-[300px]"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 relative">
        <Meteors />
            <div className="w-full max-w-3xl">
                <div className="w-full rounded-lg border-2 bg-card/95 backdrop-blur-sm p-6 shadow-lg text-center">
                    <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
                    <p className="text-muted-foreground mb-6">{error || "This event doesn't exist or has been removed."}</p>
            <Button
              onClick={() => window.location.href = '/events'}
                        variant="outline"
            >
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const targetDate = new Date(event.startTime);

  return (
      <div className="flex items-center justify-center min-h-screen p-4 relative">
          <Meteors />
          <div className="w-full max-w-3xl">
              <div className="w-full rounded-lg border-2 bg-card/95 backdrop-blur-sm p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-6">
                      <h1 className="text-2xl sm:text-3xl font-bold">{event.title}</h1>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                      >
                          {copied ? "Copied!" : <Share2 className="h-4 w-4" />}
                      </Button>
                  </div>

                  {event.description && (
                      <p className="text-muted-foreground mb-6">{event.description}</p>
                  )}

                  <div className="mb-8">
                      <div className="text-lg font-medium mb-1">Countdown</div>
                      <CountdownTimer targetDate={targetDate} />
                  </div>

                  <div className="space-y-4">
                      <div className="flex items-start gap-3">
                          <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                              <div className="text-sm text-muted-foreground">Original Time</div>
                              <div className="font-medium">
                                  {new Date(event.startTime).toLocaleString(undefined, {
                                      dateStyle: "full",
                                      timeStyle: "short"
                                  })}
                              </div>
                              <div className="text-sm text-muted-foreground/80">{event.timezone}</div>
                          </div>
                      </div>

                      <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                              <div className="text-sm text-muted-foreground">Your Local Time</div>
                              <div className="font-medium">{userLocalTime}</div>
                          </div>
                      </div>

                      <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                              <div className="text-sm text-muted-foreground">Your Timezone</div>
                              <div className="font-medium">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
