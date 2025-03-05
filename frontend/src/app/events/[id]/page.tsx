"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { animate, stagger } from "motion";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  timezone: string;
  createdAt: string;
}

export default function EventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localTime, setLocalTime] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>("");
  
  useEffect(() => {
    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
    
    // Fetch event data
    const fetchEvent = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/events/${eventId}`);
        
        if (!response.ok) {
          throw new Error('Event not found');
        }
        
        const data = await response.json();
        setEvent(data);
        
        // Convert time to user's timezone
        const eventDate = new Date(`${data.date.split('T')[0]}T${data.time}:00`);
        const eventDateTime = new Date(
          `${data.date.split('T')[0]}T${data.time}:00`
        );
        
        // Format the time in user's local timezone
        const localTimeStr = eventDateTime.toLocaleString('en-US', {
          timeZone: timezone,
          dateStyle: 'full',
          timeStyle: 'long',
        });
        setLocalTime(localTimeStr);
        
        // Calculate time remaining
        const remaining = formatDistanceToNow(eventDateTime, { addSuffix: true });
        setTimeRemaining(remaining);
        
        // Start animation after a short delay
        setTimeout(() => {
          animate(".animate-item", { opacity: 1, y: [50, 0] }, { delay: stagger(0.05) });
        }, 100);
        
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId]);
  
  // Update countdown timer every minute
  useEffect(() => {
    if (!event) return;
    
    const timer = setInterval(() => {
      const eventDateTime = new Date(`${event.date.split('T')[0]}T${event.time}:00`);
      const remaining = formatDistanceToNow(eventDateTime, { addSuffix: true });
      setTimeRemaining(remaining);
    }, 60000);
    
    return () => clearInterval(timer);
  }, [event]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-10" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p>{error || 'Event not found'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 rounded-lg border bg-card/95 backdrop-blur-sm text-card-foreground shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Event Details</h1>
          <ThemeToggle />
        </div>
        
        <div className="space-y-8">
          <div className="animate-item opacity-0">
            <h2 className="text-3xl font-bold text-center mb-2">{event.name}</h2>
            <p className="text-center text-muted-foreground">Created in timezone: {event.timezone}</p>
          </div>
          
          <div className="p-6 rounded-lg border-2 animate-item opacity-0">
            <div className="text-sm text-muted-foreground mb-1">Original Time:</div>
            <div className="text-xl">
              {new Date(`${event.date.split('T')[0]}T${event.time}:00`).toLocaleString('en-US', {
                timeZone: event.timezone,
                dateStyle: 'full',
                timeStyle: 'long',
              })}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {event.timezone}
            </div>
          </div>
          
          <div className="p-6 rounded-lg bg-green-100 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-500/50 animate-item opacity-0">
            <div className="text-sm text-muted-foreground mb-1">Your Local Time:</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {localTime}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">
              {userTimezone}
            </div>
          </div>
          
          <div className="animate-item opacity-0 text-center p-4">
            <div className="text-sm text-muted-foreground mb-2">Time Remaining:</div>
            <div className="text-3xl font-bold">{timeRemaining}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
