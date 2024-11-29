"use client";

import React, { useEffect, useState } from "react";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue,
    SelectGroup,
    SelectLabel 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getUsers } from "@/services/users";
import { useSession } from "@/app/session-provider";
import { UserProfile } from "@/types/models";

interface MultiSelectUsuariosProps {
  selectedUsers: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelectUsuarios: React.FC<MultiSelectUsuariosProps> = ({ selectedUsers, onChange }) => {
    const { user } = useSession();
    const [usuarios, setUsuarios] = useState<UserProfile[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getUsers({ empresa_id: user?.empresa.id ?? null });
            console.log("Usuarios cargados:", users);
            setUsuarios(users);
        };

        fetchUsers();
    }, [user]);

    const handleUserToggle = (userId: string) => {
        const newSelectedUsers = selectedUsers.includes(userId)
            ? selectedUsers.filter(id => id !== userId)
            : [...selectedUsers, userId];
        onChange(newSelectedUsers);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
                {selectedUsers.map(id => {
                    const usuario = usuarios.find(u => u.id === id);
                    const displayName = usuario ? (usuario.full_name || usuario.username || "Nombre no disponible") : "Usuario no encontrado";
                    return (
                        <Badge 
                            key={id} 
                            variant="secondary" 
                            className="flex items-center"
                        >
                            {displayName}
                            <button 
                                onClick={() => handleUserToggle(id)}
                                className="ml-2 text-xs hover:text-red-500"
                            >
                                ×
                            </button>
                        </Badge>
                    );
                })}
            </div>

            <Select onValueChange={(value) => handleUserToggle(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar Usuarios" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Usuarios Disponibles</SelectLabel>
                        {usuarios.map(usuario => (
                            <SelectItem 
                                key={usuario.id} 
                                value={usuario.id}
                                disabled={selectedUsers.includes(usuario.id)}
                            >
                                {usuario.full_name || usuario.username || "Nombre no disponible"}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default MultiSelectUsuarios;