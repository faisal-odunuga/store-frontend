'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  // e.g. /admin/products/new
  const segments = pathname.split('/').filter(Boolean); // ['admin', 'products', 'new']

  return (
    <nav className='flex items-center text-sm text-muted-foreground mb-4'>
      <Link href='/admin' className='flex items-center hover:text-primary transition-colors'>
        <Home className='h-4 w-4 mr-1' />
        Admin
      </Link>
      {segments.map((segment, index) => {
        if (segment === 'admin') return null;

        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const displayName = segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <div key={href} className='flex items-center'>
            <ChevronRight className='h-4 w-4 mx-1' />
            {isLast ? (
              <span className='font-medium text-foreground'>{displayName}</span>
            ) : (
              <Link href={href} className='hover:text-primary transition-colors'>
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
