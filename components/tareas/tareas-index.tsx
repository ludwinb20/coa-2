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
    <div className="p-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tareas</h2>
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
        <DataTableTarea columns={columnsTarea} data={tarea} />
      </div>
    </div>
  );
};

export default TareaIndex;
