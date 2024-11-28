"use client";
import { DataTableClients } from "@/components/clients/table";
import { columnsClients } from "@/components/clients/columns";


import { useRouter } from "next/navigation";
import rolesPermissions from "@/utils/roles";
import { useSession } from "@/app/session-provider";
import { Campo, Campologs } from "@/types/models";

import { DataTableCampo } from "./table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columnsLogs } from "./columns";

type Props = {
  campologs: Campologs[];
};

const CamposLogsIndex = ({ campologs }: Props) => {
  const router = useRouter();
  const {user} = useSession();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <div className="flex justify-end items-center mb-2">
            {user && rolesPermissions.clients_create.includes(user.profile.rol_id)}
          </div>
        </CardHeader>
        <CardContent>
          <DataTableCampo   
            columns={columnsLogs}
            data={campologs}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CamposLogsIndex;
