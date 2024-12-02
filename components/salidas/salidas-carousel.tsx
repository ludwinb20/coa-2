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

  const getStatusColor = (estado: string | null) => {
    console.log('Estado recibido:', estado);
    
    const normalizedStatus = estado?.toLowerCase().trim() ?? '';
    console.log('Estado normalizado:', normalizedStatus);

    let colorClass = '';
    
    if (normalizedStatus === 'entregado') {
      colorClass = 'bg-green-100 !text-green-800 border border-green-200';
    } else if (normalizedStatus === 'pendiente de entrega') {
      colorClass = 'bg-orange-100 !text-orange-800 border border-orange-200';
    } else if (normalizedStatus === 'en campo') {
      colorClass = 'bg-yellow-100 !text-yellow-800 border border-yellow-200';
    } else {
      colorClass = 'bg-gray-100 !text-gray-800 border border-gray-200';
    }

    console.log('Clase de color aplicada:', colorClass);
    
    return colorClass;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const assets = await getCampoAssets(campoid);
        console.log("Assets recibidos:", assets);
        setCampoAssets(assets);

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
          campoAssets.map((asset) => {
            console.log("Renderizando asset:", {
              id: asset.id,
              estado: asset.estado,
              colorClass: getStatusColor(asset.estado)
            });

            return (
              <CarouselItem key={asset.id} className="pl-2 md:pl-4 flex-none w-1/3">
                <Card className="w-full">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Assets Usados</CardTitle>
                      <div 
                        className={`
                          px-3 py-1 
                          text-sm 
                          rounded-full 
                          font-medium 
                          inline-flex 
                          items-center 
                          justify-center 
                          whitespace-nowrap 
                          ${getStatusColor(asset.estado)}
                        `}
                        style={{}}
                      >
                        {asset.estado || "Sin estado"}
                      </div>
                    </div>
                  </CardHeader>
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
            );
          })
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



