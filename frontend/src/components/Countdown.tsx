"use client";
import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string | Date;
  targetTimezone: string;
}

export default function Countdown({ targetDate, targetTimezone }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const eventTime = new Date(targetDate);
      
      // Convert to the same format for comparison
      const diff = eventTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsPast(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      // Calculate time units
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate, targetTimezone]);
  
  return (
    <div className="p-6 bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-lg">
      {isPast ? (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white">This event has already happened!</h3>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-white">Countdown</h3>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-slate-700/70 p-4 rounded-lg">
              <div className="text-4xl font-bold text-white">{timeLeft.days}</div>
              <div className="text-sm text-gray-300">Days</div>
            </div>
            <div className="bg-slate-700/70 p-4 rounded-lg">
              <div className="text-4xl font-bold text-white">{timeLeft.hours}</div>
              <div className="text-sm text-gray-300">Hours</div>
            </div>
            <div className="bg-slate-700/70 p-4 rounded-lg">
              <div className="text-4xl font-bold text-white">{timeLeft.minutes}</div>
              <div className="text-sm text-gray-300">Minutes</div>
            </div>
            <div className="bg-slate-700/70 p-4 rounded-lg">
              <div className="text-4xl font-bold text-white">{timeLeft.seconds}</div>
              <div className="text-sm text-gray-300">Seconds</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}