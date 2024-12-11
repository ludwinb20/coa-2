"use client";
import { useSession } from "@/app/session-provider";

import { getAsset } from "@/services/asset";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AssetIndex from "@/components/asset/asset-index";
import { getTareas } from "@/services/tareas";
import TareaIndex from "@/components/tareas/tareas-index";

export default function Tareas() {

  const { user } = useSession();
  const { data: tarea, isLoading } = useQuery({
    queryKey: ["tareas", user?.id],
    queryFn: () => getTareas(),
  });
  return (
    <div className="">
      {isLoading ? (
        <div>Cargando Tareas...</div>
      ) : (
      <TareaIndex tarea={tarea ?? []} />
    )}
    </div>
  );
}
