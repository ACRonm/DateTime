import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "Timezone Converter",
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
          <body className={`${inter.className} antialiased`}>
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
