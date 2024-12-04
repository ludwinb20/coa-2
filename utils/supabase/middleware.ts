import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next();

  const cookieStore = {
    get(name: string) {
      const cookieHeader = request.headers.get('cookie');
      if (!cookieHeader) return undefined;
      const cookies = cookieHeader
        .split('; ')
        .map(cookie => {
          const [key, ...rest] = cookie.split('=');
          return { name: key, value: rest.join('=') };
        });
      const foundCookie = cookies.find(cookie => cookie.name === name);
      return foundCookie ? foundCookie.value : undefined;
    },
    set(name: string, value: string, options: any) {
      supabaseResponse.cookies.set(name, value, options);
    },
    remove(name: string, options: any) {
      supabaseResponse.cookies.set(name, '', { ...options, maxAge: -1 });
    },
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieStore,
    }
  );

  // Importante: Evitar lógica compleja entre createServerClient y supabase.auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // Redirigir al usuario si no está autenticado
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
