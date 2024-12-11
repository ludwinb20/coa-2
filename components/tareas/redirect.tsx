import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {  ObserveIcon } from '@/icons/icons';

interface SimpleButtonRedirectProps {
 
  id: number; 
}

const SimpleButtonRedirect: React.FC<SimpleButtonRedirectProps> = ({  id }) => {
  const { push } = useRouter();

  const handleClick = () => {
    push(`/dashboard/tareas/${id}`);
  };

  return (
    <Button variant="ghost" className="h-8 w-8 p-0" onClick={handleClick}>
      <span className="sr-only">Ir a detalles</span>
     <ObserveIcon className="h-4 w-4" />
    </Button>
  );
};

export default SimpleButtonRedirect;