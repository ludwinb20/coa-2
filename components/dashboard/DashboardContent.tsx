'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/session-provider';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

export const DashboardContent = () => {
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error al cerrar sesión:', error.message);
        return;
      }

      router.push('/login');
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error);
    }
  };

  if (!user) {
    return null; 
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-3xl p-6 bg-black text-white shadow-md rounded-md">
        
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}; 