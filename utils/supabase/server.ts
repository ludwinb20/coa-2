// utils/supabase/server.ts
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
