"use client";
import { useSession } from "@/app/session-provider";
import ClientsCreate from "@/components/clients/clients-create";

export default function Clients() {
    const {user} = useSession();
    
    return (
        <div className="p-6">
          <ClientsCreate/>
        </div>
      );
}
