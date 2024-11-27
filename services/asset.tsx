import { Asset } from "@/types/asset";
import { uploadFile } from "@/utils/handle-files";

import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export const getAsset = async ({
  empresa_id,
}: {
  empresa_id: number | null;
}): Promise<Asset[]> => {

  if (!empresa_id) return [];

  try {
    const { data: assets, error } = await supabase
      .from("asset")
      .select(`
        *,
        category:categoria_id (
          id,
          nombre
        )
      `)
      .eq("company_id", empresa_id)
      .eq("active", true)
      .order("id", {
        ascending: true,
      });

      if (!assets || assets.length === 0) {
        console.info("No se encontraron clientes.");
        return [];
      }
  

      const assetsWithFiles = await Promise.all(
        assets.map(async (asset: Asset) => {
          if (!asset.file) {
            return { ...asset, url: null };
          }
  
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from("assets")
            .createSignedUrl(`assets/${asset.file}`, 3600);
  
          if (signedUrlError || !signedUrlData) {
            console.error(`Error creando URL firmada para el archivo ${asset.file}:`, signedUrlError?.message);
            return { ...asset, url: null };
          }
  
          return { ...asset, url: signedUrlData.signedUrl };
        })
      );



    if (error) throw error;
    return assetsWithFiles || [];
  } catch (error) {
    console.error("Error fetching Assets:", error);
    return [];
  }
};

export const createAsset = async ({
  company_id,
  name,
  precio,
  estado,
  disponibilidad,
  categoria,
  file
}: {
  company_id: number;
  name: string;
  precio: number;
  estado: string;
  disponibilidad: boolean;
  file?: File;
  categoria: number;
}): Promise<{ client: Asset | null; success: boolean }> => {
  console.log({ company_id, name, precio, estado, disponibilidad, categoria });
  let uploadedFile: string | null = null;
  if (file) {
    const result = await uploadFile({ bucket: "assets", url: "assets", file: file });
    if (result.success) uploadedFile = result.data;
  }
  const { data, error } = await supabase.from("asset").insert([
    {
      company_id: company_id,
      nombre: name,
      precio: precio,
      estado: estado,
      disponibilidad: disponibilidad,
      categoria_id: categoria,
      file: uploadedFile,
    },
  ]);


  if (error) {
    console.log("Error creando asset:", error);
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