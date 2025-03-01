"use client";
import ConverterForm from "@/components/ConverterForm";
import { Meteors } from "@stianlarsen/meteors";

export default function Home() {
  return (
      <div className="relative min-h-screen w-full">
          <Meteors />
          <div className="relative flex min-h-screen flex-col items-center justify-between p-4 sm:p-12 md:p-24">
              <div className="w-full max-w-4xl flex flex-col items-center space-y-8">
                  <h1 className="text-4xl font-bold text-foreground">DateTime</h1>
          <ConverterForm />
              </div>
          </div>
      </div>
  );
}
