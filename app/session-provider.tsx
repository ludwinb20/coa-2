'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UserFront } from '@/types/users';

const SessionContext = createContext<{ user: UserFront | null }>({ user: null });

export function SessionProvider({user, children }: {user: UserFront | null, children: React.ReactNode }) {
  const [userstate, setUserstate] = useState<UserFront | null>(user);
  const supabase = createClient();

  console.log('User:', user);

  useEffect(() => {
    // Obtener el usuario actual

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
     if(!session) setUserstate(null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <SessionContext.Provider value={{ user: userstate }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  return useContext(SessionContext);
};

