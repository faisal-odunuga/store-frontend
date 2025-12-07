'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AdminBreadcrumbs } from '@/components/admin/breadcrumbs';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className='flex h-screen items-center justify-center'>Loading...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return null; // Will redirect
  }

  return (
    <div className='flex min-h-screen bg-muted/40'>
      {/* Sidebar */}
      {/* Sidebar - Desktop */}
      <aside className='fixed inset-y-0 left-0 z-10 w-64 border-r bg-background hidden md:block'>
        <div className='flex h-full flex-col'>
          <div className='flex h-14 items-center border-b px-6'>
            <Link href='/admin' className='flex items-center gap-2 font-semibold'>
              <span className='text-xl'>Admin Panel</span>
            </Link>
          </div>
          <nav className='flex-1 overflow-y-auto py-4'>
            <ul className='grid gap-1 px-4'>
              <li>
                <Link
                  href='/admin'
                  className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted'
                >
                  <LayoutDashboard className='h-4 w-4' />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href='/admin/orders'
                  className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted'
                >
                  <ShoppingBag className='h-4 w-4' />
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href='/admin/products'
                  className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted'
                >
                  <Package className='h-4 w-4' />
                  Products
                </Link>
              </li>
            </ul>
          </nav>
          <div className='p-4 border-t'>
            <Button variant='outline' className='w-full justify-start gap-2' onClick={logout}>
              <LogOut className='h-4 w-4' />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='md:hidden fixed top-4 left-4 z-50'>
            <Menu className='h-5 w-5' />
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='w-[80%] max-w-xs p-0'>
          <SheetHeader className='px-6 py-4 border-b'>
            <SheetTitle className='text-left'>Admin Panel</SheetTitle>
          </SheetHeader>
          <div className='flex h-full flex-col'>
            <nav className='flex-1 overflow-y-auto py-4'>
              <ul className='grid gap-1 px-4'>
                <li>
                  <Link
                    href='/admin'
                    className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted'
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <LayoutDashboard className='h-4 w-4' />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href='/admin/orders'
                    className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted'
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <ShoppingBag className='h-4 w-4' />
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    href='/admin/products'
                    className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted'
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Package className='h-4 w-4' />
                    Products
                  </Link>
                </li>
              </ul>
            </nav>
            <div className='p-4 border-t'>
              <Button variant='outline' className='w-full justify-start gap-2' onClick={logout}>
                <LogOut className='h-4 w-4' />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className='flex-1 md:ml-64 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden'>
        <AdminBreadcrumbs />
        {children}
      </main>
    </div>
  );
}
