'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const SessionContext = createContext<{ user: any | null }>({ user: null });

export function SessionProvider({user, children }: {user: any, children: React.ReactNode }) {
  const [userstate, setUserstate] = useState<any | null>(user);
  const supabase = createClient();

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

