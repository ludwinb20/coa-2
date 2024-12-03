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
import { use } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default function Page(Props: Props) {
  const params = use(Props.params);
  const { id } = params;
  const numericId = parseInt(id);

  const { user } = useSession();

  const { data: campo, isLoading } = useQuery({
    queryKey: ["campo", user],
    queryFn: () => getSalidas(),
  });

  const { data: campologs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["campologs", user],
    queryFn: () => getCampoLogs(numericId),
  });
  if (!user) {
    return <div>Loading user session...</div>;
  }

  if (user && !rolesPermissions.access_clients_index.includes(user?.profile.rol_id)) {
    return <NotAllowed />;
  }

  return (
    <div className="pr-8 pl-8 pt-8">
      {isLoading ? (
        <div>Cargando campos...</div>
      ) : (
        <>
          <div className="flex justify-between gap-8">
            <div className="flex-1">
              <CampoList campoid={numericId} />
            </div>
            <div className="flex-1 ml-20">
              <ViewUsuarios campoId={numericId} />
            </div>
          </div>
          <div className="mb-4" />
          <CamposLogsIndex campologs={campologs ?? []} />
        </>
      )}
    </div>
  );
}