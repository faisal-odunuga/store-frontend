'use client';

import { useMemo } from 'react';
import { Product } from '@/lib/definitions';
import { computeProductComputed, ProductComputed } from '@/lib/productComputed';

export function useProductComputed(product?: Product | null): ProductComputed {
  return useMemo(() => computeProductComputed(product), [product]);
}
