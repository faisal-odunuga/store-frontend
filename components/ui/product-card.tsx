'use client';

import { Product } from '@/lib/definitions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if clicked within a link
    addItem(product);
  };

  return (
    <Link href={`/products/${product.id}`} className='group'>
      <Card className='h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 bg-secondary/10'>
        <div className='aspect-square relative overflow-hidden bg-white'>
          <img
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            className='object-contain w-full h-full transition-transform duration-500 group-hover:scale-110'
          />
          {product.stock <= 0 && (
            <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
              <span className='text-white font-bold uppercase tracking-wider'>Out of Stock</span>
            </div>
          )}
        </div>
        <CardContent className='p-4'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              {product.category}
            </span>
            <span className='font-bold text-lg text-primary'>
              ${product.price.toLocaleString()}
            </span>
          </div>
          <h3 className='font-semibold text-base line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors'>
            {product.name}
          </h3>
          <p className='text-sm text-muted-foreground line-clamp-2'>{product.description}</p>
        </CardContent>
        <CardFooter className='p-4 pt-0'>
          <Button
            className='w-full gap-2 transition-all'
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className='w-4 h-4' />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
