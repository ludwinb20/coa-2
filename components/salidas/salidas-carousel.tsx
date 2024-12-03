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
import { Loader2, Plus, X } from "lucide-react";
import Image from 'next/image';
import { getAsset, getAssetById } from "@/services/asset";
import { useSession } from "@/app/session-provider";
import { Asset } from "@/types/asset";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createIncidencia, newLog } from "@/services/salidas";

import Dropzone from "@/components/ui/dropzone";
import { toast } from "sonner";

interface CampoListProps {
  campoid: number;
}

interface StatusButtonProps {
  estado: string | null;
  onClick?: () => void;
}

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

const StatusButton: React.FC<StatusButtonProps> = ({ estado, onClick }) => {
  const colorClass = getStatusColor(estado);
  const isEnCampo = estado?.toLowerCase().trim() === 'en campo';

  return (
    <button
      onClick={() => {
        if (isEnCampo && onClick) {
          console.log('hola');
          onClick();
        }
      }}
      className={`
        px-3 py-1 
        text-sm 
        rounded-full 
        font-medium 
        ${isEnCampo ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'}
        transition-colors
        ${colorClass}
      `}
      disabled={!isEnCampo}
    >
      {estado || "Sin estado"}
    </button>
  );
};

const CampoList: React.FC<CampoListProps> = ({ campoid }) => {
  const [campoAssets, setCampoAssets] = useState<CampoAssets[]>([]);
  const [campoUserAssets, setCampoUserAssets] = useState<{ [key: number]: Asset[] }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CampoAssets | null>(null);
  const { user } = useSession();
  const [selectedValue, setSelectedValue] = useState("no");
  const [observaciones, setObservaciones] = useState("");
  const [fileUploads, setFileUploads] = useState<Array<{ id: number, file: File | null }>>([
    { id: 1, file: null }
  ]);

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

  const handleStatusClick = (asset: CampoAssets) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const addFileUpload = () => {
    const newId = fileUploads.length + 1;
    setFileUploads([...fileUploads, { id: newId, file: null }]);
  };

  const removeFileUpload = (id: number) => {
    if (fileUploads.length > 1) {
      setFileUploads(fileUploads.filter(upload => upload.id !== id));
    }
  };

  const handleFileChange = (id: number, file: File | null) => {
    setFileUploads(fileUploads.map(upload => 
      upload.id === id ? { ...upload, file } : upload
    ));
  };

  const handleAccept = async () => {
    if (!selectedAsset || !user?.id) {
      toast.error("Falta información necesaria");
      return;
    }

    setIsLoading(true);
    const usuario_id = user.id as `${string}-${string}-${string}-${string}-${string}`;

    try {
      // Crear el log
      const logResult = await newLog(
        campoid,
        "Entrada de equipo",
        selectedAsset.id,
        usuario_id,
        observaciones
      );

      if (!logResult.success) {
        throw new Error("Error al crear el log");
      }

      // Si se seleccionó "no", crear incidencias para cada foto
      if (selectedValue === "no") {
        if (!observaciones) {
          toast.error("Por favor, describe los problemas encontrados");
          setIsLoading(false);
          return;
        }

        // Crear una incidencia por cada archivo
        for (const upload of fileUploads) {
          if (upload.file) {
            const incidenciaResult = await createIncidencia({
              campo_id: campoid,
              asset_id: selectedAsset.id,
              file: upload.file
            });

            if (!incidenciaResult.success) {
              throw new Error(`Error al crear la incidencia para el archivo ${upload.file.name}`);
            }
          }
        }

        toast.success("Incidencias registradas correctamente");
      }

      // Actualizar el estado local
      setCampoAssets(prevAssets => 
        prevAssets.map(asset => 
          asset.id === selectedAsset.id 
            ? { ...asset, estado: 'Entregado' }
            : asset
        )
      );

      toast.success("Proceso completado exitosamente");
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Error en el proceso");
    } finally {
      setIsLoading(false);
    }
  };

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
    <>
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
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Assets Usados</CardTitle>
                      <StatusButton 
                        estado={asset.estado}
                        onClick={() => handleStatusClick(asset)}
                      />
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verificación de Estado del Equipo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <Label>¿El equipo se recibió en el mismo estado que se entregó?</Label>
              <RadioGroup
                value={selectedValue}
                onValueChange={setSelectedValue}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="si" />
                  <Label htmlFor="si">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>

              {selectedValue === "no" && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="observaciones">
                      Por favor, describe los problemas encontrados:
                    </Label>
                    <Textarea
                      id="observaciones"
                      placeholder="Detalla los daños o problemas encontrados..."
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  {/* Múltiples Dropzones */}
                  <div className="space-y-4">
                    <Label>Evidencia fotográfica:</Label>
                    {fileUploads.map((upload) => (
                      <div key={upload.id} className="relative">
                        <Dropzone
                          onDrop={(files) => handleFileChange(upload.id, files[0])}
                          onDelete={() => handleFileChange(upload.id, null)}
                          className="bg-blue-100 border-2 border-dotted border-gray-300 rounded-lg py-4 px-6 text-center text-xs"
                          text="Arrastre una imagen aquí o haga click para seleccionar"
                        />
                        {upload.file && (
                          <p className="text-sm text-gray-500 mt-1">
                            Archivo seleccionado: {upload.file.name}
                          </p>
                        )}
                        {fileUploads.length > 1 && (
                          <button
                            onClick={() => removeFileUpload(upload.id)}
                            className="absolute -right-2 -top-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFileUpload}
                      className="w-full mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar otra foto
                    </Button>
                  </div>
                </div>
              )}
              
              
            </div>
            <Button 
              onClick={handleAccept} 
              className="mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Aceptar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CampoList;



