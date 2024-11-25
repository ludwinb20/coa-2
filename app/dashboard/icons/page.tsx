"use client";
import { useSession } from "@/app/session-provider";
import NotAllowed from "@/components/layout/not-allowed";
import rolesPermissions from "@/utils/roles";
import IconsIndex from "@/components/icons";

export default function Clients() {
  const { user } = useSession();

  if (!rolesPermissions.access_clients_index.includes(user.profile.rol_id)) {
    return <NotAllowed />;
  }

  return (
    <div className="p-6">
        <IconsIndex />
    </div>
  );
}