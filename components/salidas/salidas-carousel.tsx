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
import { Card, CardContent, CardHeader } from "../ui/card";
import { Loader2 } from "lucide-react";
import Image from 'next/image';

interface CampoListProps {
  campoid: number;
}

const CampoList: React.FC<CampoListProps> = ({ campoid }) => {
  const [campoAssets, setCampoAssets] = useState<CampoAssets[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const assets = await getCampoAssets(campoid);
        setCampoAssets(assets);
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
        align: "center",
        loop: true,
      }}
      className="w-full max-w-xs relative"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {campoAssets.length > 0 ? (
          campoAssets.map((asset) => (
            <CarouselItem key={asset.id} className="pl-2 md:pl-4 w-full">
              <Card className="w-full">
                <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt={asset.assets?.nombre || "Asset image"}
                    width={100}
                    height={100}
                    className="rounded-full mb-4"
                  />
                  <span className="text-xl font-semibold">{asset.assets?.nombre || "Sin nombre"}</span>
                  <span className="text-sm text-muted-foreground">Asset ID: {asset.id}</span>
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
      <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
      <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" />
    </Carousel>
  )
}

export default CampoList


