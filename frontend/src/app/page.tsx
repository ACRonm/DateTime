"use client";
import ConverterForm from "@/components/ConverterForm";
import { Meteors } from "@stianlarsen/meteors";

export default function Home() {
  return (
      <div className="relative min-h-screen w-full">
          <Meteors />
          <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-12 md:p-24">
              <h1 className="text-4xl font-bold p-5 text-white">DateTime</h1>
              <div className="w-full max-w-4xl">
          <ConverterForm />
              </div>
      </main>
      </div>
  );
}
