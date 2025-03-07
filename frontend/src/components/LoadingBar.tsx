// src/components/LoadingBar.tsx
"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Use a ref to track the previous route
  const previousPathRef = useEffect(() => {
    let progressInterval: NodeJS.Timeout | undefined;
    let timeoutId: NodeJS.Timeout | undefined;
    
    // When pathname or searchParams change, trigger loading
    const startLoading = () => {
      // Clear any existing timers
      if (progressInterval) clearInterval(progressInterval);
      if (timeoutId) clearTimeout(timeoutId);
      
      setIsLoading(true);
      setProgress(0);
      
      // Simulate progress incrementing
      progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= 90) {
            // Stop at 90% and wait for completion
            return 90;
          }
          return prevProgress + 10;
        });
      }, 100);
      
      // Complete loading after a short delay (for immediate navigation)
      timeoutId = setTimeout(() => {
        completeLoading();
      }, 500);
    };
    
    const completeLoading = () => {
      // Jump to 100% on completion
      setProgress(100);
      
      // Clear the interval
      if (progressInterval) clearInterval(progressInterval);
      
      // After showing 100%, fade out
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    };
    
    // Start loading when the component mounts
    startLoading();
    
    // Cleanup function to clear timers
    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pathname, searchParams]); // Re-run when the route changes

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress 
        value={progress} 
        className="h-1 bg-slate-700" 
      />
    </div>
  );
}