"use client";
import { useSession } from "@/app/session-provider";
import AssetIndex from "@/components/asset/asset-index";
import { getAsset } from "@/services/asset";
import { Asset } from "@/types/asset";
import { useEffect, useState } from "react";

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const { user } = useSession();
  console.log("Assets:", assets);

  useEffect(() => {
    const fetchAssets = async () => {
      const assets = await getAsset({ empresa_id: user.empresa.id ?? null });
      console.log("Assets:", assets);
      setAssets(assets);
    };

    fetchAssets(); 
  }, []);
  return (
    <div className="p-6">
      <AssetIndex asset={assets} />
    </div>
  );
}
