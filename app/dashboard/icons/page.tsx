"use client";
import { useSession } from "@/app/session-provider";
import NotAllowed from "@/components/layout/not-allowed";
import rolesPermissions from "@/utils/roles";
import IconsIndex from "@/components/icons";

export default function IconsIndexPage() {
  const { user } = useSession();

  if (user && !rolesPermissions.access_clients_index.includes(user.profile.rol_id)) {
    return <NotAllowed />;
  }

  return (
    <div className="">
        <IconsIndex />
    </div>
  );
}