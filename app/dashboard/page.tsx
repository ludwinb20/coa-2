'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from "@/app/login/actions";
import { Button } from '@/components/ui/button';
import { useSession } from '../session-provider';
import { getValidSubdomain } from '@/utils/multi-tenant';

export default async function PrivatePage() {
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log('No ha iniciado sesión');
      router.push('/login'); // Redirige a la página de login
      return;
    }

    const { subdomain, baseDomain } = getValidSubdomain(window.location.host);

    if (!subdomain) {
      console.log('No hay subdominio');
      router.push('/'); 
      return;
    }

    if (user.empresa.subdominio !== subdomain) {
      console.log('El subdominio no coincide');
      const newSubdomain = user.empresa.subdominio;
      const newUrl = `http://${newSubdomain}.${baseDomain}${window.location.pathname}`;
      console.log(newUrl);
      window.location.href = newUrl; 
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    signOut().then(() => {
      window.location.reload();
    });
  };

  return (
    <div>
      <p>Hello {user?.profile?.id}</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
