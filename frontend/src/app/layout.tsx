import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
    title: "DateTime",
    description: "Convert times between different timezones",
    icons: {
        icon: [
            {
                media: '(prefers-color-scheme: light)',
                url: '/favicon.svg',
                href: '/favicon.svg',
            },
            {
                media: '(prefers-color-scheme: dark)',
                url: '/favicon.svg',
                href: '/favicon.svg',
            },
        ],
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
          <body className={`${GeistSans.className} antialiased`}>
              <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
              >
                  {children}
              </ThemeProvider>
      </body>
    </html>
  );
}
