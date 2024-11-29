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
        .select('*,profiles:usuario_id(id,username,avatar_url,full_name)')
        .eq('campo_id', campoId);
        
    const usersWithUrls = await Promise.all(
        (data || []).map(async (profile: CampoUsuarios) => {
            if (!profile.profiles?.avatar_url) {
                return { ...profile, url: null };
            }

            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from("avatars")
                .createSignedUrl(`users/${profile.profiles.avatar_url}`, 3600);

            if (signedUrlError || !signedUrlData) {
                console.error(`Error creating signed URL for ${profile.profiles.avatar_url}:`, signedUrlError?.message);
                return { ...profile, url: null };
            }

            return { ...profile, url: signedUrlData.signedUrl };
        })
    );

    if (error) {
        throw new Error(error.message);
    }

    return usersWithUrls;
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

