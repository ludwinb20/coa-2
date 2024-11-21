'use server'
import { createClient } from "@/utils/supabase/server";
import { UserFront } from "@/types/users";
import { cookies } from "next/headers";


export async function getUser(){
    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    // console.log('Auth Data:', authData);
    // console.log('Auth Error:', authError);
  
    if (authError || !authData?.user) {
      return  {status: 'error', data: null};
    }
  
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData?.user.id)
      .single();
  
    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      return {status: 'error', data: null};
    }
  
    const { data: empresa, error: empresaError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', profile.empresa_id)
      .single();
  
    if (empresaError || !empresa) {
      console.error('Error fetching empresa:', empresaError);
      return {status: 'error', data: null};
    }

    const userob: UserFront = {
      id: authData.user.id,
      profile: profile,
      empresa: empresa
    }
    return {status: 'success', data: userob}
}