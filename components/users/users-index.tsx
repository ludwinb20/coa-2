"use client";
import { UserProfile } from "@/types/models";
import { DataTableUsers } from "@/components/users/table";
import { columnsUsers } from "@/components/users/columns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import rolesPermissions from "@/utils/roles";
import { useSession } from "@/app/session-provider";
type Props = {
  users: UserProfile[];
};

const UsersIndex = ({ users }: Props) => {
  const router = useRouter();
  const {user} = useSession();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <div className="flex justify-end items-center mb-2">
            {user && rolesPermissions.clients_create.includes(user.profile.rol_id) &&
            <Button
              onClick={() => {
                router.push("/dashboard/users/create");
              }}
              variant="default"
              size="sm"
            >
              Agregar Usuario
            </Button>
            }
          </div>
        </CardHeader>
        <CardContent>
          <DataTableUsers
            columns={columnsUsers}
            data={users}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersIndex;
