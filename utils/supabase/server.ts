import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function createClient(request?: NextRequest, response?: NextResponse) {
  const cookieStore = cookies();

  const customCookieStore = {
    get(name: string) {
      return cookieStore.get(name)?.value;
    },
    set(name: string, value: string, options: CookieOptions) {
      cookieStore.set({ name, value, ...options });
    },
    remove(name: string, options: CookieOptions) {
      cookieStore.set({ name, value: '', ...options });
    },
    getAll() {
      return cookieStore.getAll();
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: customCookieStore }
  );
}
