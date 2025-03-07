import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { LoadingBar } from "@/components/LoadingBar";
import { PageTransition } from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Timezone - Manage Time Across Zones",
    description: "Convert times, schedule events, and manage time across multiple timezones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
              <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
              >
                  <LoadingBar />
                  <div className="flex h-screen">
                      <div className="hidden md:block">
                          <Sidebar />
                      </div>
                      <div className="flex-1 overflow-y-auto">
                          <PageTransition>
                              {children}
                          </PageTransition>
                      </div>
                  </div>
              </ThemeProvider>
      </body>
    </html>
  );
}
