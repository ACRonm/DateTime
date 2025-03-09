import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { LoadingBar } from "@/components/LoadingBar";
import { PageTransition } from "@/components/PageTransition";
import { MobileNav } from "@/components/MobileNav";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Timezone Management",
    description: "Convert times across timezones, schedule events, and manage global meetings with ease.",
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', type: 'image/x-icon' }
        ],
    },
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Timezone"
    },
};

export const viewport: Viewport = {
    themeColor: "#00A36C",
    width: "device-width",
    initialScale: 1,
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
                  <MobileNav />
              </ThemeProvider>
          </body>
      </html>
  );
}
