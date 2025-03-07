"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { animate, stagger } from "motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TimezoneSelect } from "./TimezoneSelect";
import { getApiUrl } from "@/lib/api-config";

// Form schema validation
const formSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  eventDate: z.date({
    required_error: "Event date is required",
  }),
  eventTime: z.string().min(1, "Event time is required"),
  timezone: z.string().min(1, "Please select a timezone"),
});

interface EventFormProps {
  onEventCreate?: (event: any) => void;
}

export default function EventForm({ onEventCreate }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [timezones, setTimezones] = useState<{id: string; displayName: string}[]>([]);
  const [isLoadingTimezones, setIsLoadingTimezones] = useState(true);
    const [eventCreated, setEventCreated] = useState<{ id: string, name: string, shareUrl: string } | null>(null);
    const [apiError, setApiError] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventDate: undefined,
      eventTime: "",
      timezone: "",
    },
  });

  // Get user's timezone and available timezones on component mount
  useEffect(() => {
    setIsLoadingTimezones(true);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    form.setValue("timezone", userTimezone);

    try {
      const availableTimezones = Intl.supportedValuesOf("timeZone");
      // Convert to the format required by TimezoneSelect
      const formattedTimezones = availableTimezones.map(tz => ({
        id: tz,
        displayName: tz
      }));
      setTimezones(formattedTimezones);
    } catch (error) {
      // Fallback for browsers that don't support Intl.supportedValuesOf
      const fallbackTimezones = [
        "UTC",
        "America/New_York",
        "America/Los_Angeles",
        "America/Chicago",
        "Europe/London",
        "Europe/Paris",
        "Asia/Tokyo",
        "Australia/Sydney",
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ];
      const formattedTimezones = fallbackTimezones.map(tz => ({
        id: tz,
        displayName: tz
      }));
      setTimezones(formattedTimezones);
    }
    setIsLoadingTimezones(false);
  }, [form]);

    const handleSubmit = async (values: any) => {
    setIsLoading(true);
        setApiError("");

        try {
            // Create event object for API
            const eventDate = new Date(values.eventDate);
            const [hours, minutes] = values.eventTime.split(':').map(Number);
            eventDate.setHours(hours, minutes, 0, 0);

            const eventData = {
                title: values.eventName,
                description: "", // Optional field
                startTime: eventDate.toISOString(),
                timezone: values.timezone,
                shareableId: uuidv4() // Generate a UUID for shareable link
            };

            // Use the Next.js API route instead of direct API call
            const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const createdEvent = await response.json();

            // Also save to localStorage for immediate access
            const localEventData = {
                id: createdEvent.shareableId || createdEvent.id,
                name: values.eventName,
                date: format(values.eventDate, "yyyy-MM-dd"),
                time: values.eventTime,
                timezone: values.timezone,
                createdAt: new Date().toISOString(),
            };

            const events = JSON.parse(localStorage.getItem("events") || "{}");
            events[localEventData.id] = localEventData;
            localStorage.setItem("events", JSON.stringify(events));

            // Set event created state for animation
            setEventCreated({
                id: createdEvent.shareableId || createdEvent.id,
                name: values.eventName,
                shareUrl: `${window.location.origin}/event/${createdEvent.shareableId || createdEvent.id}`
            });

            // Reset form
            form.reset();

            // Notify parent component
            if (onEventCreate) {
                onEventCreate(localEventData);
            }

            // Animate result
            setTimeout(() => {
                animate(".animate-item", { opacity: 1, y: [50, 0] }, { delay: stagger(0.05) });
            }, 100);
        } catch (err) {
            console.error("Error creating event:", err);
            // Add more detailed error logging
            setApiError(`Failed to create event. ${err instanceof Error ? err.message : "Please try again."}`);

            // Fall back to local storage only
            const eventId = uuidv4();
            const localEventData = {
                id: eventId,
                name: values.eventName,
                date: format(values.eventDate, "yyyy-MM-dd"),
                time: values.eventTime,
                timezone: values.timezone,
                createdAt: new Date().toISOString(),
            };

            const events = JSON.parse(localStorage.getItem("events") || "{}");
            events[eventId] = localEventData;
            localStorage.setItem("events", JSON.stringify(events));

            // Set event created state but indicate it's local only
            setEventCreated({
                id: eventId,
                name: values.eventName,
                shareUrl: `${window.location.origin}/event/${eventId}`
            });

            if (onEventCreate) {
                onEventCreate(localEventData);
            }
        } finally {
            setIsLoading(false);
        }
  };
  
  if (isLoadingTimezones) {
    return (
        <div className="w-full rounded-lg border-2 bg-card/95 backdrop-blur-sm p-6 shadow-lg min-h-[550px]">
            <div className="flex justify-end items-center mb-6">
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full rounded-lg border-2 bg-card/95 backdrop-blur-sm p-6 shadow-lg space-y-6"
      >
              <div className="flex justify-end items-center">
          <ThemeToggle />
        </div>

        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Event Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal h-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01") ||
                        date > new Date("2100-12-31")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Time</FormLabel>
                <FormControl>
                  <Input type="time" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <TimezoneSelect
                label="Timezone"
                name="timezone"
                timezones={timezones}
                value={field.value}
                setValue={field.onChange}
                required
                buttonLabel="Select Event Timezone..."
              />
              <FormMessage />
            </FormItem>
          )}
        />

              {apiError && (
                  <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 rounded">
                      {apiError}
                  </div>
              )}

        <Button 
          type="submit" 
          disabled={isLoading}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {isLoading ? "Creating..." : "Create Event"}
        </Button>
        
        {eventCreated && (
          <div className="space-y-4 p-6 rounded-lg bg-muted overflow-hidden border-2">
            <h3 className="text-xl font-bold animate-item opacity-0">
              Event Created!
            </h3>
            <div className="p-4 rounded bg-green-100 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-500/50 animate-item opacity-0">
              <div className="text-sm text-muted-foreground mb-1">Event Name:</div>
              <div className="text-2xl font-bold break-words text-green-700 dark:text-green-300">
                {eventCreated.name}
              </div>
                          <div className="text-sm text-green-600 dark:text-green-400 mt-3">
                              Shareable Link:
                              <a
                                  href={eventCreated.shareUrl}
                                  className="block mt-1 text-blue-600 dark:text-blue-400 underline overflow-hidden text-ellipsis"
                              >
                                  {eventCreated.shareUrl}
                              </a>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}