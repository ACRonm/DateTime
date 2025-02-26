"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TimezoneOutput from "./TimezoneOutput";
import { TimezoneSelect } from "./TimezoneSelect";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";

const formSchema = z.object({
  fromTimezone: z.string(),
  toTimezone: z.string(),
  dateTime: z.date(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const ConverterForm = () => {
  const [timezones, setTimezones] = useState<{
    id: string;          // Changed from Id
    displayName: string; // Changed from DisplayName
  }[]>([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [isLoadingTimezones, setIsLoadingTimezones] = useState(true);
  const [convertedTime, setConvertedTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromTimezone: "",
      toTimezone: "",
      dateTime: new Date(),
    },
  });

  useEffect(() => {
    const fetchTimezones = async () => {
      setIsLoadingTimezones(true);
      setFetchError("");
      
      try {
        const response = await fetch("http://localhost:5221/api/timezone/list", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Timezone data:', data); // Debug log
        setTimezones(data);
      } catch (error) {
        console.error('Failed to fetch timezones:', error);
        setFetchError("Failed to load timezones. Please refresh the page.");
      } finally {
        setIsLoadingTimezones(false);
      }
    };

    fetchTimezones();
  }, []);

  const onSubmit = async (values: FormSchemaType) => {
    setIsLoading(true);
    try {
      const formattedDateTime = format(values.dateTime, "yyyy-MM-dd'T'HH:mm:ss");

      const url = new URL("http://localhost:5221/api/timezone/convert");
      url.searchParams.append("fromTimezone", values.fromTimezone);
      url.searchParams.append("toTimezone", values.toTimezone);
      url.searchParams.append("dateTime", formattedDateTime);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to convert time");
      }
      const data = await response.json();
      setConvertedTime(
        format(new Date(data.convertedTime), "yyyy-MM-dd HH:mm:ss")
      );
    } catch (error) {
      console.error("Error converting time:", error);
      setConvertedTime("Error converting time");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingTimezones) {
    return <div>Loading timezones...</div>;
  }

  if (fetchError) {
    return <div className="text-red-500">{fetchError}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-2xl mx-auto p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Timezone Converter</h2>
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fromTimezone"
            render={({ field }) => (
              <TimezoneSelect
                label="From Timezone"
                name="fromTimezone"
                timezones={timezones}
                value={field.value}
                setValue={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="toTimezone"
            render={({ field }) => (
              <TimezoneSelect
                label="To Timezone"
                name="toTimezone"
                timezones={timezones}
                value={field.value}
                setValue={field.onChange}
              />
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={format(field.value, "yyyy-MM-dd'T'HH:mm:ss")}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isLoading}
          variant="outline"
          className="bg-racing-600 hover:bg-racing-700 dark:bg-racing-500 dark:hover:bg-racing-600"
        >
          {isLoading ? "Converting..." : "Convert"}
        </Button>

        {convertedTime && <TimezoneOutput convertedTime={convertedTime} />}
      </form>
    </Form>
  );
};

export default ConverterForm;
