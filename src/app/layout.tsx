import './globals.css';

import { Inter as FontSans } from 'next/font/google';
import React from 'react';

import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { Appbar } from '@/components/Appbar';
import Footer from '@/components/landing/footer/footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config/site-config';
import { cn } from '@/lib/utils';

import { Providers } from './providers';

import type { Metadata } from 'next';
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = siteConfig;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <GoogleAnalytics />
        <Providers>
          <ScrollArea className="h-screen">
            <Appbar />
            {/* this is done as to keep footer in the bottom of the page */}
            <div className="min-h-[calc(100vh-64px)]">{children}</div>
            <Footer />
          </ScrollArea>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
