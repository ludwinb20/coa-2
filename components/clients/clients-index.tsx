"use client";
import { Client } from "@/types/models";
import { DataTableClients } from "@/components/clients/table";
import { columnsClients } from "@/components/clients/columns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import rolesPermissions from "@/utils/roles";
import { useSession } from "@/app/session-provider";

type Props = {
  clients: Client[];
};

const ClientsIndex = ({ clients }: Props) => {
  const router = useRouter();
  const {user} = useSession();

  return (
    <div>
      <Card className="rounded-md border">
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <div className="flex justify-end items-center mb-2">
            {user && rolesPermissions.clients_create.includes(user.profile.rol_id) &&
            <Button
              onClick={() => {
                router.push("/dashboard/clients/create");
              }}
              variant="default"
              size="sm"
            >
              Agregar Cliente
            </Button>
            }
          </div>
        </CardHeader>
        <CardContent>
          <DataTableClients
            columns={columnsClients}
            data={clients}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsIndex;
