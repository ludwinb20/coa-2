import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error('Error al actualizar la sesión:', error);
  } else {
    console.log('Sesión actualizada:', data);
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  // console.log('*********************')
  // console.log(authError, authData)
  // console.log('*********************')

  return { response, supabase };
}
