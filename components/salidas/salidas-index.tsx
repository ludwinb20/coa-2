"use client";
import { DataTableClients } from "@/components/clients/table";
import { columnsClients } from "@/components/clients/columns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import rolesPermissions from "@/utils/roles";
import { useSession } from "@/app/session-provider";
import { Campo } from "@/types/models";
import { columnsCampo } from "./columns";
import { DataTableCampo } from "./table";

type Props = {
  campos: Campo[];
};

const CamposIndex = ({ campos }: Props) => {
  const router = useRouter();
  const {user} = useSession();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Salidas a Campos</CardTitle>
          <div className="flex justify-end items-center mb-2">
            {user && rolesPermissions.clients_create.includes(user.profile.rol_id) &&
            <Button
              onClick={() => {
                router.push("#");
              }}
              variant="default"
              size="sm"
            >
              Agregar Solicitud de Salida a campo
            </Button>
            }
          </div>
        </CardHeader>
        <CardContent>
          <DataTableCampo
            columns={columnsCampo}
            data={campos}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CamposIndex;
