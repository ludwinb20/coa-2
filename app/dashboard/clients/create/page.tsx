"use client";
import { useSession } from "@/app/session-provider";
import ClientsCreate from "@/components/clients/clients-create";
import NotAllowed from "@/components/layout/not-allowed";
import rolesPermissions from "@/utils/roles";

export default function ClientsCreatePage() {
  const { user } = useSession();

  if (user && !rolesPermissions.clients_create.includes(user.profile.rol_id)) {
    return <NotAllowed />;
  }

  return (
    <div className="">
      <ClientsCreate />
    </div>
  );
}
