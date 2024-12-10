"use client";
import { useSession } from "@/app/session-provider";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/services/events";
import CategorysIndex from "@/components/events/category/category-index";
import ProjectsIndex from "@/components/projects/projects-index";
import { getProjects } from "@/services/projects";




export default function Categorys() {
  const { user } = useSession();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: () => getProjects(),
  });

  

  
  return (
    <div className="">
      {isLoading ? (
        <div>Cargando Proyectos...</div>
      ) : (
      <ProjectsIndex projects={projects ?? []} />
    )}
    </div>
  );
}
