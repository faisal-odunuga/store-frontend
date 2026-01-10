'use client';

import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import ProductCard from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { Product } from '@/lib/definitions';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiService.product.getAll({ limit: 8 }),
  });

  const products = (data?.data?.products || []) as Product[];

  return (
    <main className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background pt-24 pb-32 lg:pt-40 lg:pb-52'>
        <div className='container mx-auto px-4 md:px-6 relative z-10'>
          <div className='flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto'>
            <div className='inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80'>
              <span className='flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse'></span>
              New Arrivals Available Now
            </div>
            <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-in fade-in slide-in-from-bottom-4 duration-1000'>
              Next-Gen Electronics <br /> for the Modern Home
            </h1>
            <p className='max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200'>
              Experience the future today. Discover our curated collection of premium gadgets, smart
              home devices, and cutting-edge accessories.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 min-w-[200px] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300'>
              <Button size='lg' className='h-12 px-8 text-lg' asChild>
                <Link href='/products'>
                  Shop Now <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' className='h-12 px-8 text-lg' asChild>
                <Link href='#features'>Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 pointer-events-none'>
          <div className='absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple-500/30 rounded-full blur-3xl animate-pulse'></div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 bg-muted/30'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border hover:shadow-md transition-shadow'>
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary'>
                <Sparkles className='h-6 w-6' />
              </div>
              <h3 className='font-bold text-xl mb-2'>Premium Quality</h3>
              <p className='text-muted-foreground'>
                Curated selection of top-tier brands and verified authentic products.
              </p>
            </div>
            <div className='flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border hover:shadow-md transition-shadow'>
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary'>
                <Zap className='h-6 w-6' />
              </div>
              <h3 className='font-bold text-xl mb-2'>Fast Delivery</h3>
              <p className='text-muted-foreground'>
                Lightning fast shipping to get your gadgets to you when you need them.
              </p>
            </div>
            <div className='flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border hover:shadow-md transition-shadow'>
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary'>
                <ShieldCheck className='h-6 w-6' />
              </div>
              <h3 className='font-bold text-xl mb-2'>Secure Warranty</h3>
              <p className='text-muted-foreground'>
                All products come with comprehensive warranty and support coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Listing */}
      <section className='py-24 container mx-auto px-4 md:px-6'>
        <div className='flex flex-col md:flex-row items-center justify-between mb-12 gap-4'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight mb-2'>Featured Products</h2>
            <p className='text-muted-foreground'>Hand-picked selections just for you.</p>
          </div>
          <Button variant='ghost' asChild>
            <Link href='/products' className='group'>
              View All
              <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-[300px] rounded-xl bg-muted animate-pulse' />
            ))}
          </div>
        ) : error ? (
          <div className='text-center py-20 bg-muted/20 rounded-xl'>
            <p className='text-destructive mb-4'>Failed to load products</p>
            <Button variant='outline' onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
