'use client';

import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { Product } from '@/lib/definitions';
import ProductCard from '@/components/ui/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface SimilarProductsProps {
  category: string;
  currentProductId: string;
}

export default function SimilarProducts({ category, currentProductId }: SimilarProductsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['similar-products', category],
    queryFn: () => apiService.product.getByCategory(category),
    enabled: !!category,
  });


  const products = (data?.data?.products || []).filter(
    (p) => p.id !== currentProductId
  ) as Product[];

  if (isLoading || products.length === 0) return null;

  return (
    <section className='mt-16 md:mt-24 space-y-6'>
      <h2 className='text-2xl font-bold'>You might also like</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-2 md:-ml-4'>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className='pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4'
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
