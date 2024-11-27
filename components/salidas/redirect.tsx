import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface SimpleButtonRedirectProps {
 
  id: number; 
}

const SimpleButtonRedirect: React.FC<SimpleButtonRedirectProps> = ({  id }) => {
  const { push } = useRouter();

  const handleClick = () => {
    push(`/dashboard/salidas/view/${id}`);
  };

  return (
    <Button variant="ghost" className="h-8 w-8 p-0" onClick={handleClick}>
      <span className="sr-only">Ir a detalles</span>
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  );
};

export default SimpleButtonRedirect;