'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email,
    password,
  }

  const {error} = await supabase.auth.signInWithPassword(data)
  if (error) {
    redirect('/error')
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email,
    password,
  }

  const { error } = await (await supabase).auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
    const supabase = createClient()
    const result = await (await supabase).auth.signOut()
    return;
  }