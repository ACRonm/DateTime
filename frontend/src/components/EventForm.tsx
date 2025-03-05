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
  const [eventCreated, setEventCreated] = useState<{id: string, name: string} | null>(null);

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

  const handleSubmit = (values: any) => {
    setIsLoading(true);

    // Generate unique ID for the event
    const eventId = uuidv4();

    // Create event object
    const eventData = {
      id: eventId,
      name: values.eventName,
      date: values.eventDate,
      time: values.eventTime,
      timezone: values.timezone,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const events = JSON.parse(localStorage.getItem("events") || "{}");
    events[eventId] = eventData;
    localStorage.setItem("events", JSON.stringify(events));

    // Set event created state for animation
    setEventCreated({
      id: eventId,
      name: values.eventName
    });

    // Reset form
    form.reset();
    setIsLoading(false);

    // Notify parent component
    if (onEventCreate) {
      onEventCreate(eventData);
    }
    
    // Animate result
    setTimeout(() => {
      animate(".animate-item", { opacity: 1, y: [50, 0] }, { delay: stagger(0.05) });
    }, 100);
  };
  
  if (isLoadingTimezones) {
    return (
      <div className="relative space-y-8 w-full max-w-2xl p-4 sm:p-6 rounded-lg border bg-card text-card-foreground shadow-sm min-h-[600px]">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
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
        className="relative space-y-8 w-full max-w-2xl p-4 sm:p-6 rounded-lg border bg-card/95 backdrop-blur-sm text-card-foreground shadow-sm min-h-[600px]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Event</h2>
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
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                ID: {eventCreated.id}
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}