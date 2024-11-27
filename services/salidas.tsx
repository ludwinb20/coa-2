import { Asset } from "@/types/asset";
import { Campo, CampoAssets, Campologs, CampoUsuarios } from "@/types/models";
import { uploadFile } from "@/utils/handle-files";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export const getSalidas = async (): Promise<Campo[]> => {
    const { data, error } = await supabase
        .from('campo')
        .select((`
            *,
            clients:cliente_id (
              id,
              name
            )
          `));

    if (error) {
        throw new Error(error.message);
    }

    return data as Campo[];
}



export const getCampoUsuario = async (campoId: number): Promise<CampoUsuarios[]> => {
    const { data, error } = await supabase
        .from('campo_usuarios')
        .select('*')
        .eq('campo_id', campoId);

    if (error) {
        throw new Error(error.message);
    }

    return data as CampoUsuarios[];
}

export const getCampoLogs = async (campoId: number): Promise<Campologs[]> => {
    const { data, error } = await supabase
        .from('campo_logs')
        .select('*')
        .eq('campo_id', campoId);

    if (error) {
        throw new Error(error.message);
    }

    return data as Campologs[];
}

export const getAssetById = async ({
    campo_id,
  }: {
    campo_id: number | null;
  }): Promise<Asset[]> => {
  
    
  
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
        .eq("id", campo_id)
        .eq("active", true)
        ;
  
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