import { Campo, CampoAssets, Campologs, CampoUsuarios } from "@/types/models";
import { uploadFile } from "@/utils/handle-files";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export const getCampoAssets = async (campoId: number): Promise<CampoAssets[]> => {
    try {
        const { data, error } = await supabase
            .from('campo_assets')
            .select(`
                *,
                assets:asset_id (
                  id,
                  nombre,
                  precio,
                  categoria_id,
                  disponibilidad,
                  company_id,
                  created_at,
                  estado
                ),
                profiles:usuario_id (
                  id,
                  username
                )
            `)
            .eq('campo_id', campoId);

        if (error) {
            throw new Error(error.message);
        }

        return data as CampoAssets[];
    } catch (err) {
        console.error("Error fetching campo assets:", err);
        throw new Error("Failed to fetch campo assets");
    }
}
