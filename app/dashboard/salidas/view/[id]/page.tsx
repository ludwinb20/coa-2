"use client";

import { useQuery } from "@tanstack/react-query";
import rolesPermissions from "@/utils/roles";
import { getCampoLogs, getSalidas } from "@/services/salidas";
import CampoList from "@/components/salidas/salidas-carousel";
import NotAllowed from "@/components/layout/not-allowed";
import { useSession } from "@/app/session-provider";
import CamposIndex from "@/components/salidas/salidas-index";
import CamposLogsIndex from "@/components/salidas/logs/logs-index";
import ViewUsuarios from "@/components/salidas/usuarios/view-usuarios";

 function Campo(Props: any) {
  const { user } = useSession();

  if (!user) {
    return <div>Loading user session...</div>;
  }

  const { data: campo, isLoading } = useQuery({
    queryKey: ["campo", user],
    queryFn: () => getSalidas(),
  });

  if (!rolesPermissions.access_clients_index.includes(user.profile.rol_id)) {
    return <NotAllowed />;
  }

  const { id } = ( Props.params);

  const { data: campologs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["campologs", user],
    queryFn: () => getCampoLogs(id),
  });

  return (
    <div className="p-6">
      {isLoading ? (
        <div>Cargando campos...</div>
      ) : (
        <>
          <div className="flex justify-between gap-8">
            <div className="flex-1">
              <CampoList campoid={id} />
            </div>
            <div className="flex-1 ml-20">
              <ViewUsuarios campoId={id} />
            </div>
          </div>
          <div className="mb-4" />
          <CamposLogsIndex campologs={campologs ?? []} />
        </>
      )}
    </div>
  );
}

export default Campo;