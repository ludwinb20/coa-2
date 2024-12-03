import React, { useEffect, useState } from 'react';
import { getCampoUsuario } from '@/services/salidas'; // Asegúrate de que la ruta sea correcta
import { CampoUsuarios } from '@/types/models';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

const ViewUsuarios: React.FC<{ campoId: number }> = ({ campoId }) => {
    const [usuarios, setUsuarios] = useState<CampoUsuarios[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await getCampoUsuario(campoId);
                setUsuarios(data);
            } catch (err: any) {
                setError(err?.message || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, [campoId]);

    console.log("usuarios",usuarios)

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full max-w-2xl">
            <ScrollArea className="h-[320px] w-full rounded-md border">
                <CardTitle className="p-4 sticky top-0 bg-background z-10">Usuarios Asignados</CardTitle>
                <div className="space-y-2 p-2">
                    {usuarios.map((usuario) => (
                        <Card 
                            key={usuario.profiles?.id ?? usuario.usuario_id} 
                            className="w-full"
                        >
                            <CardContent className="flex items-center space-x-2 p-4">
                                <Avatar className="w-[40px] h-[40px]">
                                    <AvatarImage 
                                        src={usuario.url ?? undefined} 
                                        alt={usuario.profiles?.full_name ?? "avatar"} 
                                    />
                                    <AvatarFallback>
                                        {usuario.profiles?.username?.slice(0, 2).toUpperCase() ?? "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-base">
                                        {usuario.profiles?.full_name ?? 'Usuario sin nombre'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ViewUsuarios;
