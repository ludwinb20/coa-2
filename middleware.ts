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
  const { response, supabase } = await updateSession(request);

  // const { data: authData, error: authError } = await supabase.auth.getUser();
  // console.log('*********************')
  // console.log(authError, authData)
  // console.log('*********************')

  // if (authError || !authData?.user) {
  //   console.log('No está autenticado');
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // const user = authData.user;
  // const host = request.headers.get('host');
  // const { subdomain, baseDomain } = getValidSubdomain(host);

  // if (!subdomain) {
  //   console.log('No hay subdominio');
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  // const { data: profile, error: profileError } = await supabase
  //   .from('profiles')
  //   .select('empresa_id')
  //   .eq('id', user?.id)
  //   .single();

  // if (profileError || !profile) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // const { data: empresa, error: empresaError } = await supabase
  //   .from('empresas')
  //   .select('subdominio')
  //   .eq('id', profile.empresa_id)
  //   .single();

  // if (empresaError || !empresa) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // if (empresa.subdominio !== subdomain) {
  //   console.log('El subdominio no coincide');
  //   const newSubdomain = empresa.subdominio;
  //   console.log(`${newSubdomain}.${baseDomain}/`);
  //   return NextResponse.redirect(new URL(`http://${newSubdomain}.${baseDomain}/`));
  // }
  // console.log('--------------------')
  // console.log(NextResponse.next())
  // console.log('--------------------')
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