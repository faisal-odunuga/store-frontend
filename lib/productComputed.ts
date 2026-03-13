import { Product } from './definitions';

export type ProductComputed = {
  images: string[];
  primaryImage: string;
  displayPrice: number;
  basePrice: number;
  originalPrice: number | null;
  hasDiscount: boolean;
  lowStock: boolean;
  isOut: boolean;
  isNew: boolean;
};

export function computeProductComputed(product?: Product | null): ProductComputed {
  const images = product?.images?.length
    ? product.images
    : product?.imageUrl
      ? [product.imageUrl]
      : [];

  const primaryImage = images[0] || '/placeholder.png';
  const displayPrice = product?.discountPrice ?? product?.sellingPrice ?? product?.price ?? 0;
  const basePrice = product?.sellingPrice ?? product?.price ?? displayPrice;
  const hasDiscount =
    product?.discountPrice !== null &&
    product?.discountPrice !== undefined &&
    product?.discountPrice < basePrice;
  const originalPrice = hasDiscount ? basePrice : null;
  const lowStock =
    product?.lowStockAlert !== undefined &&
    product?.stock !== undefined &&
    product.stock <= (product.lowStockAlert || 0);
  const isOut = (product?.stock ?? 0) <= 0;
  const isNew = product?.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30
    : false;

  return { images, primaryImage, displayPrice, basePrice, originalPrice, hasDiscount, lowStock, isOut, isNew };
}
