'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/session-provider';

export default function DashboardPage() {
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null; // O un spinner de carga si prefieres
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-3xl p-6 bg-black text-white shadow-md rounded-md">
        <p>Hello {user?.profile?.id}</p>
      </div>
    </div>
  );
}