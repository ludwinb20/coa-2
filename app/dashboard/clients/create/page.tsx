"use client";
import { useSession } from "@/app/session-provider";
import ClientsCreate from "@/components/clients/clients-create";
import NotAllowed from "@/components/layout/not-allowed";
import rolesPermissions from "@/utils/roles";

export default function Clients() {
  const { user } = useSession();

  if (!rolesPermissions.clients_create.includes(user.profile.rol_id)) {
    return <NotAllowed />;
  }

  return (
    <div className="p-6">
      <ClientsCreate />
    </div>
  );
}
