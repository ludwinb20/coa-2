"use client";
import { useSession } from "@/app/session-provider";
import ClientsIndex from "@/components/clients/clients-index";
import { getClients } from "@/services/clients";
import { useEffect, useState } from "react";
import { Client } from "@/types/clients";

export default function Clients() {
    const [clientes, setClientes] = useState<Client[]>([]);
    const {user} = useSession();
    
// console.log('User:', user);
    useEffect(() => {
        const fetchClients = async () => {
            const cl = await getClients({ empresa_id: user.empresa.id ?? null });
            console.log('Clientes:', cl);
            setClientes(cl);
        };
    
        fetchClients(); // Llamada a la función asíncrona
    }, []);
    
    return (
        <div className="p-6">
          <ClientsIndex clients={clientes} />
        </div>
      );
      
}
