// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getValidSubdomain } from '@/utils/multi-tenant';
import { updateSession } from '@/utils/supabase/middleware'

import { redirect } from 'next/navigation';

const PUBLIC_FILE = /\.(.*)$/;


export async function middleware(request: NextRequest) {
  // const url = request.nextUrl.clone();

  // if (
  //   PUBLIC_FILE.test(url.pathname) ||
  //   url.pathname.includes('_next') ||
  //   ['/login', '/', '/error'].includes(url.pathname)
  // ) {
  //   return NextResponse.next();
  // }

  // Verificar cookies
  
  // Actualizar la sesión

  return NextResponse.next();
}

export const config = {
  api: {
    bodyParser: false,
  },
  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};