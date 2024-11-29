"use client";

import React, { useEffect, useState } from "react";
import { getCampoAssets } from "@/services/campo_asset";
import { CampoAssets } from "@/types/models";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "../ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2 } from "lucide-react";
import Image from 'next/image';
import { getAsset, getAssetById } from "@/services/asset";
import { useSession } from "@/app/session-provider";
import { Asset } from "@/types/asset";

interface CampoListProps {
  campoid: number;
}

const CampoList: React.FC<CampoListProps> = ({ campoid }) => {
  const [campoAssets, setCampoAssets] = useState<CampoAssets[]>([]);
  const [campoUserAssets, setCampoUserAssets] = useState<{ [key: number]: Asset[] }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const assets = await getCampoAssets(campoid);
        setCampoAssets(assets);
        console.log("CampoAssets",assets)

        // Fetch user assets for each asset_id
        const userAssetsPromises = assets.map(asset => 
          getAssetById({ asset_id: asset.asset_id })
        );
        const userAssetsResults = await Promise.all(userAssetsPromises);
        
        // Create a map of asset_id to user assets
        const userAssetsMap = assets.reduce((acc, asset, index) => {
          acc[asset.asset_id] = userAssetsResults[index];
          return acc;
        }, {} as { [key: number]: Asset[] });

        setCampoUserAssets(userAssetsMap);
        setError(null);

      } catch (err) {
        console.error("Error fetching assets:", err);
        setError("Failed to load assets. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [campoid]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-[1800px] relative overflow-hidden"
    >
      <CarouselContent className="flex -ml-2 md:-ml-4">
        {campoAssets.length > 0 ? (
          campoAssets.map((asset) => (
            <CarouselItem key={asset.id} className="pl-2 md:pl-4 flex-none w-1/3">
              <Card className="w-full">
                <CardTitle className="p-4 text-lg">Assets Usados</CardTitle>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Image
                    src={campoUserAssets[asset.asset_id]?.[0]?.url || "Sin imagen"}
                    alt={asset.assets?.nombre || "Asset image"}
                    width={200}
                    height={200}
                    className="rounded-full mb-4 bg-gray-200 dark:bg-gray-800"
                  />
                  <span className="text-xl font-semibold">{asset.assets?.nombre || "Sin nombre"}</span>
                  <span className="text-sm text-muted-foreground"> ID: {asset.asset_id}</span>
                  <span className="text-sm text-muted-foreground">
                    Asignado a: {asset.profiles?.username || "Sin nombre"}
                  </span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))
        ) : (
          <CarouselItem>
            <p>No hay activos disponibles.</p>
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselPrevious className="absolute -left-12 top-1/2 transform -translate-y-1/2" />
      <CarouselNext className="absolute -right-12 top-1/2 transform -translate-y-1/2" />
    </Carousel>
  )
}

export default CampoList



