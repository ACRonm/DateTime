"use client";
import { useState } from "react";
import { Meteors } from "@stianlarsen/meteors";
import { CalendarCheck } from "lucide-react";
import EventForm from "@/components/EventForm";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState(() => {
    // Load events from localStorage when component is mounted
    if (typeof window !== "undefined") {
      const storedEvents = localStorage.getItem("events");
      return storedEvents ? JSON.parse(storedEvents) : {};
    }
    return {};
  });

  // Function to delete an event
  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = { ...events };
    delete updatedEvents[eventId];
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  return (
      <div className="flex items-center justify-center min-h-screen p-4 relative">
      <Meteors />
          <div className="w-full max-w-3xl">
              <h1 className="text-4xl font-bold text-center mb-8">
          Event Countdowns
        </h1>

              {/* Event Creation Form */}
              <EventForm onEventCreate={(newEvent) => {
                  const updatedEvents = {
                      ...events,
                      [newEvent.id]: newEvent
                  };
                  setEvents(updatedEvents);
              }} />

              {/* List of Existing Events */}
              <div className="w-full mt-8 mb-10">
                  <h2 className="text-2xl font-semibold mb-4">Your Events</h2>

                  {Object.keys(events).length === 0 ? (
                      <div className="bg-card/95 backdrop-blur-sm rounded-lg p-6 shadow-lg w-full text-center border-2">
                          <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">You haven't created any events yet</p>
                      </div>
                  ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                          {Object.entries(events).map(([id, event]: [string, any]) => (
                              <div key={id} className="bg-card/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2">
                                  <h3 className="text-xl font-medium mb-2">{event.name}</h3>
                                  <div className="mb-4">
                                      <p className="text-muted-foreground">
                      {new Date(`${event.date}T${event.time}`).toLocaleString(undefined, {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </p>
                                      <p className="text-sm text-muted-foreground/80">
                                          ({event.timezone})
                                      </p>
                                  </div>
                                  <div className="flex justify-between pt-2 border-t border-border/40">
                                      <Link
                                          href={`/event/${id}`}
                                          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors"
                                      >
                                          View Event
                                      </Link>
                                      <button
                                          onClick={() => handleDeleteEvent(id)}
                                          className="px-4 py-2 bg-background hover:bg-destructive/10 text-destructive hover:text-destructive/90 text-sm font-medium rounded-md border border-destructive/30 transition-colors"
                                      >
                                          Delete
                                      </button>
                                  </div>
                  </div>
                          ))}
                      </div>
                  )}
        </div>
      </div>
    </div>
  );
}