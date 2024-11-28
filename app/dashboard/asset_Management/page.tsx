"use client";
import { useSession } from "@/app/session-provider";

import { getAsset } from "@/services/asset";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AssetIndex from "@/components/asset/asset-index";

export default function Assets() {
  //const [assets, setAssets] = useState<Asset[]>([]);
  //console.log("Assets:", assets);
  const { user } = useSession();
  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets", user?.id],
    queryFn: () => getAsset({ empresa_id: user?.empresa.id ?? null }),
  });
  return (
    <div className="p-6">
      {isLoading ? (
        <div>Cargando activos...</div>
      ) : (
      <AssetIndex asset={assets ?? []} />
    )}
    </div>
  );
}
