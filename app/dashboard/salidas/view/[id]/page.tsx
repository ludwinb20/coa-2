"use client";

import { useQuery } from "@tanstack/react-query";
import rolesPermissions from "@/utils/roles";
import { getSalidas } from "@/services/salidas";
import CampoList from "@/components/salidas/salidas-carousel";
import NotAllowed from "@/components/layout/not-allowed";
import { useSession } from "@/app/session-provider";

 function Campo(Props: any) {
  const { user } = useSession();

  
  const { data: campo, isLoading } = useQuery({
    queryKey: ["campo", user],
    queryFn: () => getSalidas(),
  });

  if (!rolesPermissions.access_clients_index.includes(user.profile.rol_id)) {
    return <NotAllowed />;
  }

  const { id } = ( Props.params);

  return (
    <div className="p-6">
      {isLoading ? (
        <div>Cargando campos...</div>
      ) : (

       <CampoList campoid={id} />
      )}
    </div>
  );
}

export default Campo;