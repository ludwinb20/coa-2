import { Asset } from "@/types/models";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getAsset = async ({
  empresa_id,
}: {
  empresa_id: number | null;
}): Promise<Asset[]>  => {
  if (!empresa_id) return [];
  const { data, error } = await supabase
    .from("asset")
    .select("*")
    .eq("company_id", empresa_id)
    .eq("active", true)
    .order("id", {
      ascending: true,
    });;
  if (error) {
    console.error("Error fetching Assets:", error);
    return [];
  }
  return data;
};

export const createAsset = async ({
  company_id,
  name,
  precio,
  estado,
  disponibilidad,
  categoria,
}: {
  company_id: number;
  name: string;
  precio: number;
  estado: string;
  disponibilidad: boolean;
  categoria: number;
}): Promise<{ client: Asset | null; success: boolean }> => {
  // return {client: null, success: false};
  const { data, error } = await supabase.from("asset").insert([
    {
      company_id: company_id,
      nombre: name,
      precio: precio,
      estado: estado,
      disponibilidad: disponibilidad,
      categoria_id: categoria,
    },
  ]);


  if (error) {
    console.log("Error creando cliente:", error);
    return { client: null, success: false };
  }

  return { client: data, success: true };
};

export const updateAsset = async ({
  id,
  company_id,
  name,
  precio,
  estado,
  disponibilidad,
  categoria,
}: {
  id: number; // ID del activo a actualizar
  company_id: number;
  name: string;
  precio: number;
  estado: string;
  disponibilidad: boolean;
  categoria: number;
}): Promise<{ client: Asset | null; success: boolean }> => {
  const { data, error } = await supabase
    .from("asset")
    .update({
      company_id: company_id,
      nombre: name,
      precio: precio,
      estado: estado,
      disponibilidad: disponibilidad,
      categoria_id: categoria,
    })
    .eq("id", id); // Actualiza el activo con el ID especificado

  if (error) {
    console.log("Error actualizando activo:", error);
    return { client: null, success: false };
  }

  return { client: data, success: true };
};

export const deleteAsset = async ({
  id,
}: {
  id: number;
}): Promise<{ asset: Asset | null; success: boolean }> => {
  const { data, error } = await supabase
    .from("asset")
    .update({
        active: false
    })
    .eq("id", id);

  if (error) {
    console.log("Error eliminando activo:", error);
    return { asset: null, success: false };
  }

  return { asset: data, success: true };
};