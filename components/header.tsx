"use client";
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';

const Header = () => {
const { addItem, items } = useCart();

  return (
    <header className='sticky top-0 z-50 border-b bg-card'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-6'>
            <h1 className='text-2xl font-bold text-primary'>ElectroStore</h1>
            <nav className='hidden md:flex items-center gap-6'>
              <Link href='/' className='text-sm font-medium hover:text-primary transition-colors'>
                Shop
              </Link>
              <Link
                href='/admin'
                className='text-sm font-medium hover:text-primary transition-colors'
              >
                Admin
              </Link>
            </nav>
          </div>
          <div className='flex items-center gap-3 relative'>
            <Button variant='outline' size='icon' asChild>
              <Link href='/cart'>
                <ShoppingCart className='h-5 w-5' />
                {items.length > 0 && (
                  <span className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center'>
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
