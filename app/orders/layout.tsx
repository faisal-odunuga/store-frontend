import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'View your order history and track your shipments.',
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
