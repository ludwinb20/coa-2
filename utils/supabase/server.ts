import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function createClient(request?: NextRequest, response?: NextResponse) {
  const cookieStore = {
    get(name: string) {
      return request?.cookies.get(name)?.value || cookies().get(name)?.value;
    },
    set(name: string, value: string, options: CookieOptions) {
      request?.cookies.set({ name, value, ...options });
      response?.cookies.set({ name, value, ...options });
    },
    remove(name: string, options: CookieOptions) {
      request?.cookies.set({ name, value: '', ...options });
      response?.cookies.set({ name, value: '', ...options });
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieStore }
  );
}

export async function updateSession(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  let sesion = await supabase.auth.getSession()
  return { 
    // response: NextResponse.next(),
    // supabase 
    sesion
  }
}

export function setCookie(name: string, value: string, options: CookieOptions) {
  const cookieStore = cookies();
  cookieStore.set({ name, value, ...options });
}

export function removeCookie(name: string, options: CookieOptions) {
  const cookieStore = cookies();
  cookieStore.set({ name, value: '', ...options });
}