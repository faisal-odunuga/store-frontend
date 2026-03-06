import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Header from '@/components/sections/header';
import ClerkProviderWrapper from '@/components/providers/clerk-provider-wrapper';
import QueryProvider from '@/providers/QueryProvider';
import CustomerGate from '@/components/auth/customer-gate';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: {
    template: '%s | ElectroStore',
    default: 'ElectroStore - Premium Electronics & Gadgets', // This acts as Home title
  },
  description: 'Your one-stop destination for premium electronics, gadgets, and accessories.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang='en'>
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          <QueryProvider>
            <CustomerGate>
              <Header />
              {children}
              <Toaster />
            </CustomerGate>
          </QueryProvider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
