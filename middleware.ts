import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Lightweight middleware: strip Clerk handshake artifacts so URLs stay clean.
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  let changed = false;

  // Remove any __clerk* noise params
  for (const key of url.searchParams.keys()) {
    if (key.startsWith('__clerk')) {
      url.searchParams.delete(key);
      changed = true;
    }
  }

  if (changed) {
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
