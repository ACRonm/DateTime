"use client";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
        if (onComplete) onComplete();
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds, isComplete: false });
    };

    // Initial calculation
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clear interval on unmount
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <div className="flex flex-col items-center p-3 bg-slate-800/70 rounded-lg">
        <span className="text-3xl sm:text-5xl font-bold text-white">{timeLeft.days}</span>
        <span className="text-xs sm:text-sm text-slate-400 mt-1">DAYS</span>
      </div>
      <div className="flex flex-col items-center p-3 bg-slate-800/70 rounded-lg">
        <span className="text-3xl sm:text-5xl font-bold text-white">{timeLeft.hours}</span>
        <span className="text-xs sm:text-sm text-slate-400 mt-1">HOURS</span>
      </div>
      <div className="flex flex-col items-center p-3 bg-slate-800/70 rounded-lg">
        <span className="text-3xl sm:text-5xl font-bold text-white">{timeLeft.minutes}</span>
        <span className="text-xs sm:text-sm text-slate-400 mt-1">MINUTES</span>
      </div>
      <div className="flex flex-col items-center p-3 bg-slate-800/70 rounded-lg">
        <span className="text-3xl sm:text-5xl font-bold text-white">{timeLeft.seconds}</span>
        <span className="text-xs sm:text-sm text-slate-400 mt-1">SECONDS</span>
      </div>
    </div>
  );
}
