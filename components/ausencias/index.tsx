"use client";
import { Ausencia, Client } from "@/types/models";
import { DataTableAbsences } from "@/components/ausencias/table-absences";
import { columnsAusenciaEmployee } from "@/components/ausencias/columns-employee";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import rolesPermissions from "@/utils/roles";
import { useSession } from "@/app/session-provider";
import { columnsAusenciasAdmin } from "./columns-admin";

type Props = {
  ausencias: Ausencia[];
}

const AusenciasIndex = ({ ausencias }: Props) => {
  const router = useRouter();
  const { user } = useSession();
  let columns;
  if(user && [1,2].includes(user?.profile.rol_id)){
    columns = columnsAusenciasAdmin;
  }

  if(user && [3,4,6].includes(user?.profile.rol_id)){
    columns = columnsAusenciaEmployee;
  }

  return (
    <div>
      <Card className="rounded-md border">
        <CardHeader>
          <CardTitle>Ausencias</CardTitle>
          <div className="flex justify-end items-center mb-2">
            {user &&
              rolesPermissions.clients_create.includes(user.profile.rol_id) && (
                <Button
                  onClick={() => {
                    router.push("/dashboard/users/absences/create");
                  }}
                  variant="default"
                  size="sm"
                >
                  Solicitud de Ausencia
                </Button>
              )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTableAbsences
            columns={columns ?? []}
            data={ausencias}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AusenciasIndex;
