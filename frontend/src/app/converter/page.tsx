"use client";
import ConverterForm from "@/components/ConverterForm";
import { Meteors } from "@stianlarsen/meteors";

export default function ConverterPage() {
  return (
      <div className="flex items-center justify-center min-h-screen p-4 relative">
          <Meteors />
          <div className="w-full max-w-3xl">
              <h1 className="text-4xl font-bold text-center mb-8">
                  Timezone Converter
              </h1>
              <ConverterForm />
          </div>
    </div>
  );
}
