import { Project, ProjectCategory } from "@/types/models";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase.from("projects").select("*");
  if (error) throw new Error(error.message);
  return data as Project[];
};

export const createProject = async ({
  nombre,
  cliente_id,
  categoria_id,
}: {
  nombre: string;
  cliente_id: number;
  categoria_id: number;
}): Promise<{ proyecto: Project | null; success: boolean }> => {
  const { data, error } = await supabase.from("projects").insert([
    {
      nombre: nombre,
      cliente_id: cliente_id,
      categoria_id: categoria_id,
    },
  ]);

  if (error) {
    console.log("Error creando proyecto:", error);
    return { proyecto: null, success: false };
  }

  return { proyecto: data ? data[0] : null, success: true };
};

export const updateProject = async ({
  id,
  nombre,
  cliente_id,
  categoria_id,
}: {
  id?: number;
  nombre: string;
  cliente_id: number;
  categoria_id: number;
}): Promise<{ proyecto: Project | null; success: boolean }> => {
  const { data, error } = await supabase
    .from("projects")
    .update({
      nombre: nombre,
      cliente_id: cliente_id,
      categoria_id: categoria_id,
    })
    .eq('id', id)
    .select();

  if (error) {
    console.log("Error actualizando proyecto:", error);
    return { proyecto: null, success: false };
  }

  return { 
    proyecto: data ? data[0] : null, 
    success: true 
  };
};

export const deleteProject = async (id: number): Promise<{ success: boolean }> => {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("Error eliminando proyecto:", error);
    return { success: false };
  }

  return { success: true };
};

export const getCategories = async (): Promise<ProjectCategory[]> => {
  const { data, error } = await supabase.from("projects_category").select("*");
  if (error) throw new Error(error.message);
  return data as ProjectCategory[];
};

export const createCategory = async ({
  nombre,
  descripcion,
}: {
  nombre: string;
  descripcion: string;
}): Promise<{ categoria: ProjectCategory | null; success: boolean }> => {
  const { data, error } = await supabase
    .from("projects_category")
    .insert([
      {
        nombre: nombre,
        descripcion: descripcion,
        created_at: new Date().toISOString(),
      },
    ])
    .select(); // Añadimos .select() para obtener los datos insertados

  if (error) {
    console.log("Error creando categoría:", error);
    return { categoria: null, success: false };
  }

  return { 
    categoria: data && data.length > 0 ? data[0] : null, 
    success: true 
  };
};
