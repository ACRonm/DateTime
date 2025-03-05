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
    <div className="relative w-full min-h-screen">
      <Meteors />
      <div className="relative flex h-full min-h-screen flex-col items-center justify-start pt-20 p-4">
        <h1 className="text-4xl font-bold p-5 text-white text-center w-full">
          Event Countdowns
        </h1>
        
        <div className="flex flex-col w-full max-w-3xl gap-8">
          {/* Event Creation Form */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4 text-white">Create New Event</h2>
            <EventForm onEventCreate={(newEvent) => {
              const updatedEvents = {
                ...events,
                [newEvent.id]: newEvent
              };
              setEvents(updatedEvents);
            }} />
          </div>

          {/* List of Existing Events */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Events</h2>
            
            {Object.keys(events).length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg w-full text-center">
                <CalendarCheck className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                <p className="text-slate-300">You haven't created any events yet</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(events).map(([id, event]: [string, any]) => (
                  <div key={id} className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                    <h3 className="text-xl font-medium text-white mb-2">{event.name}</h3>
                    <p className="text-slate-300 mb-3">
                      {new Date(`${event.date}T${event.time}`).toLocaleString(undefined, {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                      <span className="block text-sm opacity-80">({event.timezone})</span>
                    </p>
                    <div className="flex justify-between">
                      <Link 
                        href={`/event/${id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                      >
                        View Event
                      </Link>
                      <button 
                        onClick={() => handleDeleteEvent(id)}
                        className="px-4 py-2 bg-transparent hover:bg-red-600/20 text-red-400 hover:text-red-300 text-sm font-medium rounded-lg border border-red-500/30"
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
    </div>
  );
}