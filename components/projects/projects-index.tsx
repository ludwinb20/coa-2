"use client";
import { Client, Project } from "@/types/models";
import { DataTableClients } from "@/components/clients/table";
import { columnsClients } from "@/components/clients/columns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import rolesPermissions from "@/utils/roles";
import { useSession } from "@/app/session-provider";
import { columnsProjects } from "./columns";

type Props = {
  projects: Project[];
};

const ProjectsIndex = ({ projects }: Props) => {
  const router = useRouter();
  const {user} = useSession();

  return (
    <div>
      <Card className="rounded-md border">
        <CardHeader>
          <CardTitle>Proyectos</CardTitle>
          <div className="flex justify-end items-center mb-2">
            {user && rolesPermissions.clients_create.includes(user.profile.rol_id) &&
            <Button
              onClick={() => {
                router.push("/dashboard/projects/create");
              }}
              variant="default"
              size="sm"
            >
              Agregar Proyecto
            </Button>
            }
          </div>
        </CardHeader>
        <CardContent>
          <DataTableClients
            columns={columnsProjects}
            data={projects}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsIndex;


