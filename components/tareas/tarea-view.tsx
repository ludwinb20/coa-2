"use client";

import { useEffect, useState } from "react";
import { Tarea, TareaFile } from "@/types/models";
import { getTareaFiles } from "@/services/tareas";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileIcon, Loader2, CalendarDays, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TareaViewProps {
  tarea: Tarea;
}

export default function TareaView({ tarea }: TareaViewProps) {
  const [files, setFiles] = useState<TareaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      if (tarea.id) {
        const tareaFiles = await getTareaFiles(tarea.id);
        setFiles(tareaFiles);
      }
      setIsLoading(false);
    };

    loadFiles();
  }, [tarea.id]);

  const formatEstado = (estado: string) => {
    const estadoMap: { [key: string]: string } = {
      'en_progreso': 'En Progreso',
      'pendiente': 'Pendiente',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return estadoMap[estado] || estado;
  };

  const getEstadoVariant = (estado: string) => {
    const estadoVariants: { [key: string]: string } = {
      'en_progreso': 'outline',
      'pendiente': 'warning',
      'completada': 'success',
      'cancelada': 'destructive'
    };
    return estadoVariants[estado] || 'default';
  };

  const getPrioridadVariant = (prioridad: string) => {
    const prioridadVariants: { [key: string]: string } = {
      'alta': 'destructive',
      'media': 'warning',
      'baja': 'success'
    };
    return prioridadVariants[prioridad] || 'default';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-muted/50 rounded-t-lg">
          <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                {tarea.nombre}
              </CardTitle>
              <div className="flex items-center text-muted-foreground space-x-2">
                <CalendarDays className="w-4 h-4" />
                <span className="text-sm">
                  Creado el {new Date(tarea.fecha_inicio).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={tarea.estado}>
                {formatEstado(tarea.estado)}
              </Badge>
              <Badge variant={tarea.prioridad}>
                Prioridad {tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <Separator />

        <CardContent className="space-y-6 pt-6">
          {/* Descripción */}
          <section>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-muted-foreground" />
              Descripción
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap pl-7">
              {tarea.descripcion || "Sin descripción"}
            </p>
          </section>

          <Separator />

          {/* Fechas */}
          <section className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2" />
                Fecha de inicio
              </h3>
              <p className="pl-6 text-foreground">
                {new Date(tarea.fecha_inicio).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2" />
                Fecha final
              </h3>
              <p className="pl-6 text-foreground">
                {new Date(tarea.fecha_final).toLocaleDateString()}
              </p>
            </div>
          </section>

          <Separator />

          {/* Personas */}
          <section className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Encargado
              </h3>
              <div className="flex items-center gap-3 pl-6">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={tarea.profiles_encargado?.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {tarea.profiles_encargado?.full_name?.slice(0, 2).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground">
                  {tarea.profiles_encargado?.full_name || "Sin asignar"}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Creador
              </h3>
              <div className="flex items-center gap-3 pl-6">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={tarea.profiles_creador?.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {tarea.profiles_creador?.full_name?.slice(0, 2).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground">
                  {tarea.profiles_creador?.full_name || "Sin asignar"}
                </span>
              </div>
            </div>
          </section>

          {/* Archivos adjuntos */}
          {files.length > 0 && (
            <>
              <Separator />
              <section>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <FileIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                  Archivos adjuntos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.map((file, index) => (
                    <a
                      key={index}
                      href={file.url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors group"
                    >
                      <FileIcon className="w-10 h-10 text-primary mr-4 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {file.file.split('/').pop()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click para descargar
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}