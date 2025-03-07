import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TimezonesPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 text-center">
      <div className="space-y-6 max-w-md mx-auto p-6 rounded-lg border-2 bg-card/95 backdrop-blur-sm shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Timezones Feature
        </h1>
        <p className="text-xl text-muted-foreground">
          Hold tight! This feature is coming soon. We're working hard to bring you 
          a comprehensive timezone management experience.
        </p>
        <div className="animate-pulse mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-primary/20">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-primary"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <Link href="/" passHref>
          <Button variant="outline" className="mt-8">
            Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
