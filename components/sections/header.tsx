'use client';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth-context';

const Header = () => {
  const { addItem, items } = useCart();
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className='sticky top-0 z-50 border-b bg-card'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-6'>
            <Link href='/' className='text-2xl font-bold text-primary'>
              ElectroStore
            </Link>
            <nav className='hidden md:flex items-center gap-6'>
              <Link href='/' className='text-sm font-medium hover:text-primary transition-colors'>
                Shop
              </Link>
              {user && (
                <Link
                  href='/settings'
                  className='text-sm font-medium hover:text-primary transition-colors'
                >
                  Settings
                </Link>
              )}
            </nav>
          </div>
          <div className='flex items-center gap-3 relative'>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='md:hidden'>
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='top' className='w-full'>
                <SheetHeader>
                  <SheetTitle>ElectroStore</SheetTitle>
                  <SheetDescription>Navigation Menu</SheetDescription>
                </SheetHeader>
                <div className='flex flex-col gap-4 mt-8'>
                  <Link
                    href='/'
                    className='text-lg font-medium hover:text-primary transition-colors'
                    onClick={() => setIsOpen(false)}
                  >
                    Shop
                  </Link>
                  {user && (
                    <Link
                      href='/settings'
                      className='text-lg font-medium hover:text-primary transition-colors'
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>
                  )}
                  <div className='border-t pt-4 mt-2'>
                    {user ? (
                      <div className='flex flex-col gap-4'>
                        <span className='text-sm font-medium text-muted-foreground'>
                          Signed in as {user.name}
                        </span>
                        <Button variant='outline' className='w-full justify-start' onClick={logout}>
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className='flex flex-col gap-2'>
                        <Button
                          variant='outline'
                          asChild
                          className='w-full justify-start'
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href='/auth/login'>Login</Link>
                        </Button>
                        <Button
                          asChild
                          className='w-full justify-start'
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href='/auth/signup'>Sign Up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className='hidden md:flex items-center gap-3 relative'>
              {user ? (
                <div className='flex items-center gap-4'>
                  <span className='text-sm font-medium'>Hi, {user.name}</span>
                  <Button variant='ghost' size='sm' onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Button variant='ghost' size='sm' asChild>
                    <Link href='/auth/login'>Login</Link>
                  </Button>
                  <Button size='sm' asChild>
                    <Link href='/auth/signup'>Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>

            {user && (
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
