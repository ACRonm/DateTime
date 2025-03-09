"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Clock, Calendar, Globe, Settings, Home } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  
  const routes = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5 mr-2" /> },
    { href: "/converter", label: "Converter", icon: <Clock className="h-5 w-5 mr-2" /> },
    { href: "/events", label: "Events", icon: <Calendar className="h-5 w-5 mr-2" /> },
    { href: "/timezone", label: "Timezone", icon: <Globe className="h-5 w-5 mr-2" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5 mr-2" /> },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden fixed top-4 right-4 z-50"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="text-xl font-semibold mb-2 text-primary">Timezone</h2>
            <p className="text-sm text-muted-foreground">Navigation</p>
          </div>
          <div className="px-1">
            <nav className="flex flex-col space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center py-3 px-3 rounded-md hover:bg-accent"
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}