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

export const getCampoAssets = async (campoId: number): Promise<CampoAssets[]> => {
    const { data, error } = await supabase
        .from('campo_assets')
        .select('*')
        .eq('campo_id', campoId);

    if (error) {
        throw new Error(error.message);
    }

    return data as CampoAssets[];
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

