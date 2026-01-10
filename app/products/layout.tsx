import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our extensive collection of premium electronics.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
