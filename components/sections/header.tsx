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
import {
  ShoppingCart,
  Menu,
  User as UserIcon,
  LogOut,
  Package,
  Settings,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth-context';

const Header = () => {
  const { addItem, cart } = useCart();
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
              <Link
                href='/products'
                className='text-sm font-medium hover:text-primary transition-colors'
              >
                Shop
              </Link>
            </nav>
          </div>
          <div className='flex items-center gap-3 relative'>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='gap-2 pl-0 md:pl-4'>
                    <UserIcon className='h-5 w-5 md:h-4 md:w-4' />
                    <span className='hidden md:block max-w-[100px] truncate'>{user.name}</span>
                    <ChevronDown className='hidden md:block h-3 w-3 opacity-50' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href='/orders' className='cursor-pointer'>
                      <Package className='nr-2 h-4 w-4 mr-2' />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href='/settings' className='cursor-pointer'>
                      <Settings className='nr-2 h-4 w-4 mr-2' />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className='text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer'
                  >
                    <LogOut className='nr-2 h-4 w-4 mr-2' />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='hidden md:flex items-center gap-2'>
                <Button variant='ghost' size='sm' asChild>
                  <Link href='/auth/login'>Login</Link>
                </Button>
                <Button size='sm' asChild>
                  <Link href='/auth/signup'>Sign Up</Link>
                </Button>
              </div>
            )}

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
                <div className='flex flex-col items-center gap-6 mt-8'>
                  <Link
                    href='/'
                    className='text-lg font-medium hover:text-primary transition-colors'
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href='/products'
                    className='text-lg font-medium hover:text-primary transition-colors'
                    onClick={() => setIsOpen(false)}
                  >
                    Shop
                  </Link>
                  <Link
                    href='/cart'
                    className='text-lg font-medium hover:text-primary transition-colors md:hidden'
                    onClick={() => setIsOpen(false)}
                  >
                    Cart
                  </Link>

                  {/* Mobile Mobile Auth Buttons if not logged in */}
                  {!user && (
                    <div className='flex flex-col gap-3 w-full max-w-xs'>
                      <Button
                        variant='outline'
                        asChild
                        className='w-full'
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href='/auth/login'>Login</Link>
                      </Button>
                      <Button asChild className='w-full' onClick={() => setIsOpen(false)}>
                        <Link href='/auth/signup'>Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {user && (
              <Button variant='outline' size='icon' asChild>
                <Link href='/cart'>
                  <ShoppingCart className='h-5 w-5' />
                  {cart.length > 0 && (
                    <span className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center'>
                      {cart.reduce((acc, item) => acc + item.quantity, 0)}
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
