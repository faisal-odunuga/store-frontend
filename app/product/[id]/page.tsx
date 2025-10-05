'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useRouter } from 'next/navigation';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items } = useCart();
  const router = useRouter();

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    router.push('/cart');
  };

  const cartItem = items.find((item) => item.id === product.id);
  const availableStock = product.stock - (cartItem?.quantity || 0);

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <Button variant='ghost' asChild className='mb-6'>
          <Link href='/'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Shop
          </Link>
        </Button>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Image Gallery */}
          <div className='space-y-4'>
            <div className='relative aspect-square bg-muted rounded-lg overflow-hidden'>
              <Image
                src={product.images[selectedImage] || '/placeholder.svg'}
                alt={product.name}
                fill
                className='object-cover'
                priority
              />
              {product.stock === 0 && (
                <Badge className='absolute top-4 right-4 bg-destructive text-destructive-foreground'>
                  Out of Stock
                </Badge>
              )}
              {product.stock > 0 && product.stock < 30 && (
                <Badge className='absolute top-4 right-4 bg-secondary text-secondary-foreground'>
                  Low Stock
                </Badge>
              )}
            </div>
            <div className='grid grid-cols-3 gap-4'>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-muted-foreground/50'
                  }`}
                >
                  <Image
                    src={image || '/placeholder.svg'}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className='object-cover'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className='space-y-6'>
            <div>
              <p className='text-sm text-muted-foreground mb-2'>{product.maker}</p>
              <h1 className='text-3xl font-bold mb-4 text-balance'>{product.name}</h1>
              <p className='text-4xl font-bold text-primary'>${product.price.toFixed(2)}</p>
            </div>

            <div>
              <h2 className='text-lg font-semibold mb-2'>Description</h2>
              <p className='text-foreground/80 leading-relaxed'>{product.description}</p>
            </div>

            <div>
              <h2 className='text-lg font-semibold mb-3'>Specifications</h2>
              <div className='flex flex-wrap gap-2'>
                {product.specs.map((spec, index) => (
                  <Badge key={index} variant='secondary' className='text-sm'>
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className='p-6 space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Availability:</span>
                  <span
                    className={`text-sm font-semibold ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.stock > 0 ? `${availableStock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {product.stock > 0 && (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Quantity:</span>
                      <div className='flex items-center gap-3'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className='h-4 w-4' />
                        </Button>
                        <span className='text-lg font-semibold w-12 text-center'>{quantity}</span>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                          disabled={quantity >= availableStock}
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>

                    <Button
                      className='w-full'
                      size='lg'
                      onClick={handleAddToCart}
                      disabled={availableStock === 0}
                    >
                      <ShoppingCart className='mr-2 h-5 w-5' />
                      Add to Cart - ${(product.price * quantity).toFixed(2)}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <div className='text-sm text-muted-foreground space-y-1'>
              <p>• Free shipping on orders over $500</p>
              <p>• 30-day return policy</p>
              <p>• 1-year manufacturer warranty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
