
import { Category } from "@/types/category";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getCategories = async ({
  empresa_id,
}: {
  empresa_id: number | null;
}): Promise<Category[]>  => {
  console.log("Empresa ID:", empresa_id);
  if (!empresa_id) return [];
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("company_id", empresa_id)
    .order("id", {
      ascending: true,
    });;
  console.log("Categories:", data, "Error:", error);
  if (error) {
    console.error("Error fetching Categories:", error);
    return [];
  }
  return data;
};

export const createCategory = async ({
    company_id,
    nombre,
    descripcion
  }: {
    company_id: number;
    nombre: string;
    descripcion: string;
    
  }): Promise<{ categoria: Category | null; success: boolean }> => {
    console.log({ company_id, nombre,});
    const { data, error } = await supabase.from("category").insert([
      {
        company_id: company_id,
        nombre: nombre,
        descripcion:descripcion
      },
    ]);
  
    console.log("Categoria creada:", data, "Error:", error);
  
    if (error) {
      console.log("Error creando categoria:", error);
      return { categoria: null, success: false };
    }
  
    return { categoria: data, success: true };
  };

export const updateCategory = async ({
  id,
  company_id,
  nombre,
}: {
  id: number;
  company_id: number;
  nombre: string;
}): Promise<{ categoria: Category | null; success: boolean }> => {
  console.log({ id, company_id, nombre });
  const { data, error } = await supabase
    .from("category")
    .update({
      company_id: company_id,
      nombre: nombre,
    })
    .eq("id", id);

  console.log("Categoria actualizada:", data, "Error:", error);

  if (error) {
    console.log("Error actualizando categoria:", error);
    return { categoria: null, success: false };
  }

  return { categoria: data, success: true };
};

export const deleteCategory = async ({
  id,
}: {
  id: number;
}): Promise<{ category: Category | null; success: boolean }> => {
  console.log({ id });
  const { data, error } = await supabase
    .from("category")
    .update({
        active: false
    })
    .eq("id", id);

  console.log("Categoria eliminada:", data, "Error:", error);

  if (error) {
    console.log("Error eliminando categoria:", error);
    return { category: null, success: false };
  }

  return { category: data, success: true };
};