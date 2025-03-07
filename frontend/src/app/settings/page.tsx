"use client";
import { useState, useEffect } from "react";
import { Meteors } from "@stianlarsen/meteors";
import { PageTransition } from "@/components/PageTransition";
import { TimezoneSelect } from "@/components/TimezoneSelect";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoonIcon, SunIcon, GlobeIcon, BellIcon, UserIcon, PaletteIcon, SaveIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(undefined);
  const [defaultTimezone, setDefaultTimezone] = useState("");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [autoDetectTimezone, setAutoDetectTimezone] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timezoneOptions, setTimezoneOptions] = useState<Array<{id: string; displayName: string}>>([]);
  
  useEffect(() => {
    setMounted(true);
    
    if (theme) {
      setSelectedTheme(theme);
    }
  }, [theme]);
  
  useEffect(() => {
    if (!mounted) return;
    
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setDefaultTimezone(settings.defaultTimezone || "");
        setTimeFormat(settings.timeFormat || "12h");
        setDateFormat(settings.dateFormat || "MM/DD/YYYY");
        setAutoDetectTimezone(settings.autoDetectTimezone ?? true);
        setEventReminders(settings.eventReminders ?? true);
      } catch (e) {
        console.error("Error parsing saved settings:", e);
      }
    } else {
      setDefaultTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [mounted]);
  
  useEffect(() => {
    try {
      const availableTimezones = Intl.supportedValuesOf('timeZone');
      const formattedTimezones = availableTimezones.map(tz => ({
        id: tz,
        displayName: tz
      }));
      setTimezoneOptions(formattedTimezones);
    } catch (error) {
      const fallbackTimezones = [
        "UTC",
        "America/New_York",
        "America/Los_Angeles",
        "America/Chicago", 
        "Europe/London",
        "Europe/Paris",
        "Asia/Tokyo",
        "Australia/Sydney",
        Intl.DateTimeFormat().resolvedOptions().timeZone
      ];
      const formattedTimezones = fallbackTimezones.map(tz => ({
        id: tz,
        displayName: tz
      }));
      setTimezoneOptions(formattedTimezones);
    }
  }, []);
  
  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };
  
  const saveSettings = () => {
    setIsSaving(true);
    
    const settings = {
      defaultTimezone,
      timeFormat,
      dateFormat,
      autoDetectTimezone,
      theme: selectedTheme || theme,
      eventReminders
    };
    
    localStorage.setItem("userSettings", JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };
  
  if (!mounted) {
    return null;
  }
  
  const displayTheme = selectedTheme || resolvedTheme || "system";
  
  return (
    <PageTransition>
      <div className="relative min-h-screen">
        <Meteors />
        <div className="relative flex flex-col items-center justify-start pt-10 px-4 pb-20">
          <div className="w-full max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            
            <Tabs defaultValue="display" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="display" className="flex items-center gap-2">
                  <GlobeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Display</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <PaletteIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <BellIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="display" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Time & Date Settings</CardTitle>
                    <CardDescription>
                      Configure how times and dates are displayed throughout the app
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone-select">Default Timezone</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <TimezoneSelect
                            timezones={timezoneOptions}
                            name="timezone-select"
                            label=""
                            value={defaultTimezone}
                            setValue={(tz: string) => setDefaultTimezone(tz)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          id="auto-timezone"
                          checked={autoDetectTimezone}
                          onCheckedChange={setAutoDetectTimezone}
                        />
                        <Label htmlFor="auto-timezone">Auto-detect from system</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Time Format</Label>
                      <RadioGroup
                        value={timeFormat}
                        onValueChange={setTimeFormat}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="12h" id="12h" />
                          <Label htmlFor="12h">12-hour (2:30 PM)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="24h" id="24h" />
                          <Label htmlFor="24h">24-hour (14:30)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <RadioGroup
                        value={dateFormat}
                        onValueChange={setDateFormat}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="MM/DD/YYYY" id="mdy" />
                            <Label htmlFor="mdy">MM/DD/YYYY</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="DD/MM/YYYY" id="dmy" />
                            <Label htmlFor="dmy">DD/MM/YYYY</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="YYYY-MM-DD" id="iso" />
                            <Label htmlFor="iso">YYYY-MM-DD</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Theme Settings</CardTitle>
                    <CardDescription>
                      Customize the appearance of the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Theme Mode</Label>
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <Button
                          variant={displayTheme === "light" ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-24 gap-2"
                          onClick={() => handleThemeChange("light")}
                        >
                          <SunIcon className="h-8 w-8" />
                          <span>Light</span>
                        </Button>
                        <Button
                          variant={displayTheme === "dark" ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-24 gap-2"
                          onClick={() => handleThemeChange("dark")}
                        >
                          <MoonIcon className="h-8 w-8" />
                          <span>Dark</span>
                        </Button>
                        <Button
                          variant={displayTheme === "system" ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-24 gap-2"
                          onClick={() => handleThemeChange("system")}
                        >
                          <div className="flex">
                            <SunIcon className="h-4 w-4" />
                            <MoonIcon className="h-4 w-4" />
                          </div>
                          <span>System</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Configure event reminders and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Notification features coming soon!
                    </p>
                    
                    {/* Optional preview of future functionality */}
                    <div className="mt-4 p-4 bg-muted/40 rounded-lg border border-dashed">
                      <h3 className="text-sm font-medium mb-2">Coming features:</h3>
                      <ul className="text-sm text-muted-foreground space-y-1.5">
                        <li className="flex items-center">
                          <BellIcon className="h-3.5 w-3.5 mr-2 opacity-70" />
                          Event reminders
                        </li>
                        <li className="flex items-center">
                          <BellIcon className="h-3.5 w-3.5 mr-2 opacity-70" />
                          Custom timing preferences
                        </li>
                        <li className="flex items-center">
                          <BellIcon className="h-3.5 w-3.5 mr-2 opacity-70" />
                          Multiple notification methods
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Account management features coming soon!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-end">
              <Button
                onClick={saveSettings}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <SaveIcon className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}