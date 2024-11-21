"use client";
import { Client } from "@/types/clients";
import { DataTableClients } from "@/components/clients/table";
import { columnsClients } from "@/components/clients/columns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type Props = {
  clients: Client[];
};

const ClientsIndex = ({ clients }: Props) => {
  const router = useRouter();
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <div className="flex justify-end items-center mb-4">
            <Button
              onClick={() => {
                router.push("/dashboard/clients/create");
              }}
              variant="default"
              size="sm"
            >
              Agregar Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableClients columns={columnsClients} data={clients} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsIndex;
