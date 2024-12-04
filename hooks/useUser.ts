'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

const supabase = createClient();

export const useUser = () => {
  const [user, setUser] = useState<Session['user'] | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(data.user);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  return user;
};
