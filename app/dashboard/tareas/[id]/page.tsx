"use client";

import { useQuery } from "@tanstack/react-query";
import { getTareaById } from "@/services/tareas";
import TareaView from "@/components/tareas/tarea-view";
import { Loader2 } from "lucide-react";
import NotAllowed from "@/components/layout/not-allowed";
import { useSession } from "@/app/session-provider";
import rolesPermissions from "@/utils/roles";

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  const { id } = params;
  const numericId = parseInt(id);
  const { user } = useSession();

  const { data: tarea, isLoading } = useQuery({
    queryKey: ["tarea", numericId],
    queryFn: () => getTareaById(numericId),
  });

  if (!user) {
    return <div>Loading user session...</div>;
  }

  if (user && !rolesPermissions.access_clients_index.includes(user?.profile.rol_id)) {
    return <NotAllowed />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!tarea) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No se encontró la tarea</p>
      </div>
    );
  }

  return (
    <div className="pr-8 pl-8 pt-8">
      <TareaView tarea={tarea} />
    </div>
  );
}