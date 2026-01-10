import { Metadata } from 'next';
import ProductDetailsClient from './product-details-client';
import apiService from '@/lib/apiService';
import { extractIdFromSlug } from '@/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const id = extractIdFromSlug(params.id);

  try {
    const res = await apiService.product.getById(id);
    const product = res?.data?.product;

    if (product) {
      return {
        title: `${product.name} - ElectroStore`,
        description: product.description || `Buy ${product.name} at ElectroStore`,
        openGraph: {
          title: product.name,
          description: product.description || `Buy ${product.name} at ElectroStore`,
          images: product.imageUrl ? [product.imageUrl] : [],
        },
      };
    } else {
      console.warn(`[Metadata] Product not found for ID: ${id}`);
    }
  } catch (error) {
    console.warn('[Metadata] Failed to fetch product metadata:', error);
  }

  return {
    title: 'Product Details',
    description: 'View product details on ElectroStore',
  };
}

export default function ProductPage() {
  return <ProductDetailsClient />;
}
