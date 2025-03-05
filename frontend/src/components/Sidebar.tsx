"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Clock,
  Calendar,
  Globe,
  Settings,
  Home,
  ChevronRight,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    color: "text-primary",
  },
  {
    label: "Converter",
    icon: Clock,
    href: "/converter",
    color: "text-[#00A36C]",
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/events",
    color: "text-primary",
  },
  {
    label: "Timezones",
    icon: Globe,
    href: "/timezone",
    color: "text-[#C2B280]",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-muted-foreground",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
    
    // Check for saved preference in localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  if (!isMounted) {
    return null; // Prevents hydration errors
  }

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-sidebar-background border-r border-sidebar-border relative transition-all duration-300", 
        isCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-sidebar-border bg-background shadow-md z-10"
      >
        {isCollapsed ? (
          <PanelLeft className="h-3 w-3" />
        ) : (
          <PanelLeftClose className="h-3 w-3" />
        )}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      
      <div className="px-3 py-2 flex-1 overflow-hidden">
        <Link href="/" className={cn("flex items-center mb-6", isCollapsed ? "justify-center pl-0" : "pl-3")}>
          <div className="relative w-8 h-8 flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" className="text-primary">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" className="stroke-primary" fill="none"/>
              <path d="M16 8V16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="stroke-primary"/>
            </svg>
          </div>
          {!isCollapsed && (
            <h1 className="text-2xl font-bold tracking-tight text-sidebar-foreground ml-4">
              Timezone
            </h1>
          )}
        </Link>
        
        <div className="space-y-1">
          <TooltipProvider>
            {routes.map((route) => (
              isCollapsed ? (
                <Tooltip key={route.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={route.href}
                      className={cn(
                        "flex items-center justify-center rounded-md h-10 w-10 mx-auto transition-all",
                        pathname === route.href ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <route.icon className={cn("h-5 w-5", route.color)} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {route.label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 flex items-center rounded-md px-3 py-2 transition-all",
                    pathname === route.href && "bg-sidebar-accent text-sidebar-foreground"
                  )}
                >
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                  {pathname === route.href && <ChevronRight className="ml-auto h-4 w-4 text-sidebar-foreground/50" />}
                </Link>
              )
            ))}
          </TooltipProvider>
        </div>
      </div>
      
      <div className={cn(
        "border-t border-sidebar-border py-3",
        isCollapsed ? "px-2 items-center justify-center" : "px-6"
      )}>
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="text-sm text-sidebar-foreground/60">
              Current Timezone
              <div className="font-medium text-sidebar-foreground truncate max-w-[150px]">
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </div>
            </div>
            <ThemeToggle minimal={isCollapsed} />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center">
                    <Clock className="h-5 w-5 text-sidebar-foreground/60 mx-auto" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ThemeToggle minimal={isCollapsed} />
          </div>
        )}
      </div>
    </div>
  );
}
