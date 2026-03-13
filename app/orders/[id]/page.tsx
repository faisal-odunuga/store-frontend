import { Metadata } from 'next';
import OrderDetailsClient from './order-details-client';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  return {
    title: `Order #${id}`,
    description: `View details for order #${id}`,
  };
}

export default function OrderPage() {
  return <OrderDetailsClient />;
}
