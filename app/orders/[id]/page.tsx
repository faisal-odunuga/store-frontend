import { Metadata } from 'next';
import OrderDetailsClient from './order-details-client';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // We use the ID directly as fetching full order details requires auth cookies
  // which is complex to forward in this setup.
  const id = params.id;

  return {
    title: `Order #${id.slice(0, 8)}`,
    description: `View details for order #${id}`,
  };
}

export default function OrderPage() {
  return <OrderDetailsClient />;
}
