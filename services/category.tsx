import { Category } from "@/types/asset";
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

export const createAsset = async ({
    company_id,
    nombre,
    
   
  }: {
    company_id: number;
    nombre: string;
    
  }): Promise<{ categoria: Category | null; success: boolean }> => {
    // return {client: null, success: false};
    console.log({ company_id, nombre});
    const { data, error } = await supabase.from("category").insert([
      {
        company_id: company_id,
        nombre: nombre,
        
      },
    ]);
  
    console.log("Categoria creado:", data, "Error:", error);
  
    if (error) {
      console.log("Error creando categoria:", error);
      return { categoria: null, success: false };
    }
  
    return { categoria: data, success: true };
  };