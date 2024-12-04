"use client";
import { useSession } from "@/app/session-provider";
import NotAllowed from "@/components/layout/not-allowed";
import rolesPermissions from "@/utils/roles";
import { ScheduleIndex } from "@/components/schedule-control/schedule-index";
import { getDepartments, getMarcajes, getUsers } from "@/services/users";
import { useQuery } from "@tanstack/react-query";

export default function Schedule() {
  const { user } = useSession();

  console.log(user);

  //   const [marcajes, departamentos, usuarios] = await Promise.all([
  //     getMarcajes(),
  //     getDepartments(),
  //     getUsers({ empresa_id: user?.empresa.id ?? null }),
  //   ]);

  const { data: marcajes, isLoading } = useQuery({
    queryKey: ["marcajes", user?.id],
    queryFn: () => getMarcajes(),
  });

  if (
    user &&
    !rolesPermissions.access_users_index.includes(user?.profile.rol_id)
  ) {
    return <NotAllowed />;
  }

  return (
    <div>
      {isLoading ? (
        <div>Cargando usuarios...</div>
      ) : (
        <ScheduleIndex
          marcajes={marcajes ?? []}
          departamentos={[]}
          usuarios={[]}
        />
      )}
    </div>
  );
}
