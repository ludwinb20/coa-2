"use client";
import { Asset } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Tarea } from "@/types/models";
import { DataTableTarea } from "./table";
import { columnsTarea } from "./columns";

type Props = {
  tarea: Tarea[];
};

const TareaIndex = ({ tarea }: Props) => {
  const router = useRouter();
  return (
    <div>
    <Card className="rounded-md border">
      <CardHeader>
            <CardTitle>Tareas</CardTitle>
        <div className="flex justify-end items-center mb-4">
          <Button
            onClick={() => {
              router.push("/dashboard/tareas/create");
            }}
            variant="default"
            size="sm"
          >
            Agregar Tarea
          </Button>
        </div>
      </CardHeader>
      <CardContent>
            <DataTableTarea columns={columnsTarea} data={tarea} />
      </CardContent>
    </Card>
    </div>
  );
};

export default TareaIndex;
