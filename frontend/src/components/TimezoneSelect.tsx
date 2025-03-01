"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimezoneSelectProps {
  timezones: {
    id: string;          // Changed from Id
    displayName: string; // Changed from DisplayName
  }[];
  name: string;
  label: string;
  value?: string;
  setValue?: (value: string) => void;
    required?: boolean;  // Add this line
}

export function TimezoneSelect({
  timezones,
  name,
  label,
  value,
  setValue,
    required,  // Add this line
}: TimezoneSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTimezones = React.useMemo(() => {
    if (!searchQuery) return timezones;
    
    return timezones.filter((timezone) => 
      timezone.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timezone.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [timezones, searchQuery]);

  return (
    <Popover key={name} open={open} onOpenChange={setOpen}>
      <div className="grid gap-2">
        <label htmlFor={name}>{label}</label>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
                      className={cn(
                          "w-full justify-between", // Changed from w-[300px]
                          required && !value && "border-yellow-600"
                      )}
          >
            {value
              ? timezones.find((timezone) => timezone.id === value)?.displayName
              : "Select timezone..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[300px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search timezone..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No timezone found.</CommandEmpty>
              <CommandGroup key="timezones">
                {filteredTimezones.map((timezone) => (
                  <CommandItem
                    key={timezone.id}
                    value={timezone.id}
                    onSelect={(currentValue) => {
                      setValue &&
                        setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === timezone.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {timezone.displayName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
}
