"use client";
import ConverterForm from "@/components/ConverterForm";
import { Meteors } from "@stianlarsen/meteors";
import Link from 'next/link';
import { Clock, Calendar, Globe, ArrowRight, Settings, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function HomePage() {
    return (
        <div className="container max-w-6xl mx-auto px-4 py-8 relative">
            {/* Web3 Background Elements */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                <Meteors />
                <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background to-background/90 backdrop-blur-sm" />
            </div>
            <section className="py-12 md:py-24 space-y-8 relative">
                <div className="text-center space-y-4">
                    <h1 className="relative text-4xl md:text-6xl font-bold tracking-tight">
                        Timezone Management <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#00A36C]">Made Simple</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                        Convert times across timezones, schedule events, and manage global meetings with ease.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center pt-6">
                        <Button asChild size="lg" className="group bg-gradient-to-r from-primary/90 to-[#00A36C]/90 hover:from-primary hover:to-[#00A36C] text-white">
                            <Link href="/converter">
                                Try Timezone Converter
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild size="lg" className="border-primary/30 hover:bg-primary/5">
                            <Link href="/events">Create Event</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard
                    icon={<Clock className="h-10 w-10 text-[#00A36C]" />}
                    title="Timezone Converter"
                    description="Convert times between different timezones quickly and accurately with our easy-to-use converter tool."
                    href="/converter"
                />
                <FeatureCard
                    icon={<Calendar className="h-10 w-10 text-primary" />}
                    title="Event Scheduler"
                    description="Create and manage events across multiple timezones. Perfect for scheduling international meetings."
                    href="/events"
                />
                <FeatureCard
                    icon={<Globe className="h-10 w-10 text-[#C2B280]" />}
                    title="Timezone Tool"
                    description="Explore timezones around the world and find the current time in any location."
                    href="/timezone"
                />
            </section>

            {/* Benefits Section */}
            <section className="py-12 border-t border-primary/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight">Why use our Timezone tools?</h2>
                        <ul className="space-y-3">
                            <BenefitItem>Never mix up meeting times across timezones again</BenefitItem>
                            <BenefitItem>Simple, intuitive interface for quick conversions</BenefitItem>
                            <BenefitItem>Create shareable events with timezone information</BenefitItem>
                            <BenefitItem>Works across all modern devices and browsers</BenefitItem>
                        </ul>
                        <Button asChild className="bg-gradient-to-r from-primary/90 to-[#00A36C]/90 hover:from-primary hover:to-[#00A36C] text-white">
                            <Link href="/converter">Get Started</Link>
                        </Button>
                    </div>
                    <div className="relative bg-gradient-to-br from-primary/5 to-[#00A36C]/5 p-6 rounded-lg border border-primary/10 shadow backdrop-blur-sm overflow-hidden dark:from-primary/10 dark:to-[#00A36C]/10">
                        <div className="absolute inset-0 overflow-hidden opacity-10">
                            <div className="web3-grid"></div>
                        </div>
                        <ClockDisplay />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description, href }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-lg border border-primary/10 bg-background/80 p-6 shadow transition-all hover:-translate-y-1 flex flex-col h-full">
            <div className="mb-4 relative z-10">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
            <Button variant="link" asChild className="p-0 mt-auto self-start text-primary">
                <Link href={href} className="flex items-center">
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </Button>
        </div>
    );
}

function BenefitItem({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start">
            <div className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#00A36C]/20">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#00A36C] h-3 w-3"
                >
                    <path d="M20 6L9 17l-5-5" />
                </svg>
            </div>
            <span>{children}</span>
        </li>
    );
}

function ClockDisplay() {
    const [time, setTime] = useState(new Date());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Format time consistently with explicit options
    const formattedTime = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    // Only render the time client-side to prevent hydration mismatch
    return (
        <div className="aspect-video rounded flex items-center justify-between relative px-6">
            <svg width="200" height="200" viewBox="0 0 32 32" className="w-40 h-40">
                <defs>
                    <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#004225" />
                        <stop offset="100%" stopColor="#00734D" />
                    </linearGradient>
                    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%" filterUnits="objectBoundingBox">
                        <feGaussianBlur stdDeviation="1.2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Background elements - rendered first (at the bottom) */}
                <path d="M16 2L28.5 9.5V22.5L16 30L3.5 22.5V9.5L16 2Z" fill="url(#clockGradient)" opacity="0.1" />
                <circle cx="16" cy="16" r="14" fill="url(#clockGradient)" opacity="0.6" />
                <circle cx="16" cy="16" r="14" stroke="#00734D" strokeWidth="1.5" opacity="0.7" />

                {/* Clock markers */}
                <circle cx="16" cy="4.5" r="1" fill="#00734D" opacity="0.7" /> {/* 12:00 */}
                <circle cx="27.5" cy="16" r="1" fill="#00734D" opacity="0.7" /> {/* 3:00 */}
                <circle cx="16" cy="27.5" r="1" fill="#00734D" opacity="0.7" /> {/* 6:00 */}
                <circle cx="4.5" cy="16" r="1" fill="#00734D" opacity="0.7" /> {/* 9:00 */}

                {/* Animated decorative path */}
                <path d="M24 16 C24 20.3 20.3 23.5 16 23.5" stroke="#00734D" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5">
                    <animate attributeName="stroke-dashoffset" values="0;-4" dur="2s" repeatCount="indefinite" />
                </path>

                <path
                    d={`M16 16L${16 + 8 * Math.sin(time.getHours() * 30 * Math.PI / 180)} ${16 - 8 * Math.cos(time.getHours() * 30 * Math.PI / 180)}`}
                    stroke="#00A36C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    opacity="0.9"
                />
                <path
                    d={`M16 16L${16 + 10 * Math.sin(time.getMinutes() * 6 * Math.PI / 180)} ${16 - 10 * Math.cos(time.getMinutes() * 6 * Math.PI / 180)}`}
                    stroke="#C2B280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    opacity="0.9"
                />

                {/* Center circle - rendered last (on top of everything) */}
                <circle cx="16" cy="16" r="2" fill="#00734D" opacity="0.9" />
            </svg>
            <div className="text-center mt-4 text-primary">
                <p className="text-2xl font-mono">
                    {isMounted ? formattedTime : "Loading..."}
                </p>
                <p className="text-sm opacity-60">
                    {isMounted ? Intl.DateTimeFormat().resolvedOptions().timeZone : ""}
                </p>
            </div>
        </div>
    );
}
