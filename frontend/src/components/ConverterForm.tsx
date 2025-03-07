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
import { TimezoneSelect } from "./TimezoneSelect";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";
import { animate, stagger } from "motion";
import { Skeleton } from "@/components/ui/skeleton"


const formSchema = z.object({
  fromTimezone: z.string(),
  toTimezone: z.string(),
  dateTime: z.date(),
});

type FormSchemaType = z.infer<typeof formSchema>;

type ConversionResponse = {
    inputTime: string;
    inputTimezone: string;
    outputTime: string;
    outputTimezone: string;
    utcTime: string;
};

const ConverterForm = () => {
  const [timezones, setTimezones] = useState<{
    id: string;          // Changed from Id
    displayName: string; // Changed from DisplayName
  }[]>([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [isLoadingTimezones, setIsLoadingTimezones] = useState(true);
    const [conversionResult, setConversionResult] = useState<ConversionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const [is12HourTime, setIs12HourTime] = useState<boolean>(false);

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

          const baseUrl = process.env.NEXT_PUBLIC_API_URL;
          if (!baseUrl) {
              throw new Error('API URL not configured');
          }

          const response = await fetch(`${baseUrl}/timezone/list`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
          const data = await response.json();
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
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.aidenr.dev';
        const url = new URL(`${baseUrl}/timezone/convert`);
      url.searchParams.append("fromTimezone", values.fromTimezone);
      url.searchParams.append("toTimezone", values.toTimezone);
      url.searchParams.append("dateTime", formattedDateTime);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to convert time");
      }
        const data: ConversionResponse = await response.json();
        setConversionResult(data);
    } catch (error) {
      console.error("Error converting time:", error);
        setConversionResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingTimezones) {
      return (
        <div className="w-full rounded-lg border-2 bg-card/95 backdrop-blur-sm p-6 shadow-lg min-h-[550px]">
            <div className="flex justify-end items-center mb-6">
                <Skeleton className="h-10 w-10" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
    );
  }

  if (fetchError) {
      return <div className="p-4 bg-destructive/10 border-2 border-destructive text-destructive rounded-lg">{fetchError}</div>;
  }

    const timeFormatOptions: Intl.DateTimeFormatOptions = {
        timeZone: '',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: is12HourTime
    };

    // Add animation helper
    const animateResult = (element: HTMLElement) => {
        animate(".animate-item", { opacity: 1, y: [50, 0] }, { delay: stagger(0.05) })
    };

    return (
      <Form {...form}>
          <form
              onSubmit={form.handleSubmit(onSubmit)}
                className="w-full rounded-lg border-2 bg-card/95 backdrop-blur-sm p-6 shadow-lg space-y-6"
          >
                <div className="flex justify-end items-center">
                    <ThemeToggle />
              </div>

              <div className="grid grid-cols-1 gap-4">
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
                              required
                              buttonLabel="Select From Timezone..." // Added accessible name
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
                              required
                              buttonLabel="Select To Timezone..." // Added accessible name
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

              <div className="flex flex-wrap gap-2">
                  <Button
                      type="submit"
                      disabled={isLoading || !form.getValues("fromTimezone") || !form.getValues("toTimezone")}
                      variant="outline"
                  >
                      Convert
                  </Button>
                  <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIs12HourTime(!is12HourTime)}
                  >
                      {is12HourTime ? "Switch to 24-hour time" : "Switch to 12-hour time"}
                  </Button>
                  <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                          const fromTimezone = form.getValues("fromTimezone");
                          const toTimezone = form.getValues("toTimezone");
                          form.setValue("fromTimezone", toTimezone);
                          form.setValue("toTimezone", fromTimezone);
                      }}
                  >
                      Swap Timezones
                  </Button>
              </div>

              {conversionResult && (
                  <div
                      ref={(element) => {
                          if (element) {
                              animateResult(element);
                          }
                      }}
                      className="space-y-4 p-6 rounded-lg bg-muted overflow-hidden border-2"
                  >
                      <h3 className="text-xl font-bold animate-item">
                          Conversion Result
                      </h3>

                      <div className="grid gap-4">
                          <div className="p-4 rounded bg-background animate-item">
                              <div className="text-sm text-muted-foreground mb-1">From:</div>
                              <div className="text-xl font-semibold break-words">
                                  {new Date(conversionResult.inputTime).toLocaleString('en-US', {
                                      ...timeFormatOptions,
                                      timeZone: conversionResult.inputTimezone,
                                  })}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                  {conversionResult.inputTimezone}
                              </div>
                          </div>

                          <div className="flex justify-center items-center animate-item">
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                              >
                                  <path d="M12 5v14" />
                                  <path d="m19 12-7 7-7-7" />
                              </svg>
                          </div>

                          <div className="p-4 rounded bg-green-100 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-500/50 animate-item">
                              <div className="text-sm text-muted-foreground mb-1">To:</div>
                              <div className="text-2xl font-bold break-words text-green-700 dark:text-green-300">
                                  {new Date(conversionResult.outputTime).toLocaleString('en-US', {
                                      ...timeFormatOptions,
                                      timeZone: conversionResult.outputTimezone,
                                  })}
                              </div>
                              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                                  {conversionResult.outputTimezone}
                              </div>
                          </div>
                      </div>

                      <div className="mt-4 p-4 rounded bg-background/50 text-sm animate-item">
                          <details>
                              <summary className="cursor-pointer font-medium">Show raw times</summary>
                              <div className="mt-2 text-xs font-mono whitespace-pre-wrap break-words text-muted-foreground">
                                  Input: {conversionResult.inputTime}
                                  <br />
                                  Output: {conversionResult.outputTime}
                                  <br />
                                  UTC: {conversionResult.utcTime}
                              </div>
                          </details>
                      </div>
                  </div>
              )}
          </form>
      </Form>
  );
};

export default ConverterForm;
