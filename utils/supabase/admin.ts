import { createClient } from '@supabase/supabase-js';
const admin = createServiceRoleClient();

function createServiceRoleClient(){
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
  }

export async function createUser({email, password}: {email: string, password: string}) {

    const { data, error } = await admin.auth.admin.createUser({ email, password });
    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
  
    return data;
}

export async function getUsers() {
    const { data, error } = await admin.auth.admin.listUsers();
    if (error) {
      console.error('Error listing users:', error);
      return null;
    }
  
    return data;
}

export async function updateUserEmail({email, id}: {email: string, id: string}) {
    const { data, error } = await admin.auth.admin.updateUserById( id, {
        email: email
    });
    console.log('User created:', data, 'Error:', error);
    if (error) {
      console.error('Error creating user:', error);
      return false;
    }
  
    return true;
}