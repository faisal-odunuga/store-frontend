'use client';
// import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
// import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/sections/header';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';

// export const metadata: Metadata = {
//   title: 'PowerHaus',
//   description: 'Your marketplace for home appliances and electronics.',
// };

const client = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <QueryClientProvider client={client}>
          <AuthProvider>
            <Header />
            {children}
            <Toaster />
            {/* <Analytics /> */}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
