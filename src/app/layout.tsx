// import type { Metadata } from 'next';
// import { GeistSans } from 'geist/font/sans'; // Removed as package is not installed
// import { GeistMono } from 'geist/font/mono'; // Removed as package is not installed
import '../globals.css';
import { cn } from '../lib/utils';
import { Toaster } from '../components/ui/toaster';
import Header from '../components/layout/header'; // Import Header

export const metadata = {
  title: 'Creator Hub',
  description: 'Manage your profile, earn credits, and engage with content.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased'
          // GeistSans.variable // Removed as package is not installed
          // GeistMono.variable // Removed as package is not installed
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header /> {/* Add Header */}
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
