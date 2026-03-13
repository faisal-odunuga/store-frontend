'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

import ProductCard from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { categories as fallbackCategories } from '@/lib/products';
import { useFeaturedProducts } from '@/hooks/useProducts';

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-background via-background to-muted/30'>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
    </main>
  );
}

function Hero() {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background pt-20 pb-24 lg:pt-28 lg:pb-28'>
      <div className='container mx-auto px-4 md:px-8 relative z-10'>
        <div className='grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center'>
          <div className='space-y-6'>
            <div className='inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground'>
              <span className='flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse' />
              Boutique Tech • Curated Daily
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight'>
              Premium Audio &amp; Electronics, <br />
              Crafted for Obsessives.
            </h1>
            <p className='text-base md:text-lg text-muted-foreground max-w-xl'>
              Discover reference-grade headphones, studio monitors, and limited-run amplifiers from
              the world&apos;s most respected makers.
            </p>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Button size='lg' className='h-12 px-8 text-lg' asChild>
                <Link href='/products'>
                  Shop Collection <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
            </div>
            <div className='grid grid-cols-3 max-w-lg gap-4 pt-4'>
              {[
                { label: 'Delivery', value: 'Express 48h' },
                { label: 'Warranty', value: '2 Years' },
                { label: 'Verified', value: 'Authorized Stock' },
              ].map((item) => (
                <div key={item.label} className='rounded-xl bg-card border p-4 shadow-sm'>
                  <p className='text-xs text-muted-foreground uppercase tracking-widest mb-1'>
                    {item.label}
                  </p>
                  <p className='font-semibold'>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='relative'>
            <div className='aspect-square rounded-[32px] overflow-hidden border bg-card shadow-2xl'>
              <img
                src='https://images.unsplash.com/photo-1524678714210-9917a6c619c4?auto=format&fit=crop&w=1200&q=80'
                alt='Hero headphones'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='absolute -left-6 -bottom-6 bg-primary text-primary-foreground px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3'>
              <Sparkles className='h-5 w-5' />
              <div>
                <p className='text-xs uppercase tracking-widest'>New Drop</p>
                <p className='font-semibold text-sm'>Limited Studio Series</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='absolute top-0 left-0 w-full h-full pointer-events-none opacity-30'>
        <div className='absolute -left-32 top-10 h-72 w-72 bg-primary/20 blur-3xl rounded-full' />
        <div className='absolute right-10 bottom-0 h-64 w-64 bg-secondary/20 blur-3xl rounded-full' />
      </div>
    </section>
  );
}

function FeaturedCategories() {
  return (
    <section className='container mx-auto px-4 md:px-8 py-10 space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-muted-foreground uppercase tracking-widest'>Explore</p>
          <h2 className='text-2xl font-bold'>Popular Categories</h2>
        </div>
        <Button asChild variant='outline'>
          <Link href='/products'>Browse all products</Link>
        </Button>
      </div>
      <div className='flex flex-wrap gap-2'>
        {fallbackCategories
          .filter((c) => c !== 'All Categories')
          .slice(0, 8)
          .map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className='px-3 py-2 rounded-full border bg-card hover:bg-primary/10 text-sm'
            >
              {cat}
            </Link>
          ))}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const { data, isLoading } = useFeaturedProducts(10);
  const products = data?.products ?? [];

  return (
    <section className='container mx-auto px-4 md:px-8 pb-16 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-muted-foreground uppercase tracking-widest'>Featured</p>
          <h2 className='text-3xl font-black leading-tight'>Top Picks</h2>
        </div>
        <Button asChild>
          <Link href='/products'>View full catalog</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='h-[320px] rounded-xl bg-muted animate-pulse' />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
