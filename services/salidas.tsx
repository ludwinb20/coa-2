import { Asset } from "@/types/asset";
import { Campo, CampoAssets, Campologs, CampoUsuarios } from "@/types/models";
import { uploadFile } from "@/utils/handle-files";
import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";
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

interface AssetAssignment {
  asset_id: string;
  usuario_id: string;
}

export const createCampo = async ({
    proyecto_id,
    cliente_id,
    fecha_inicio,
    fecha_final,
    usuario_ids,
    asset_assignments,
}: {
    proyecto_id: number;
    cliente_id: number;
    fecha_inicio: Date;
    fecha_final: Date;
    usuario_ids: string[];
    asset_assignments: AssetAssignment[];
}): Promise<{ campo: Campo | null; success: boolean }> => {
    // Primera inserción - campo
    const { data, error } = await supabase.from("campo").insert([
        {
            proyecto_id,
            cliente_id,
            fecha_inicio,
            fecha_final
        },
    ]).select().single();

    if (error) {
        console.error("Error creando campo:", error);
        return { campo: null, success: false };
    }

    // Segunda inserción - campo_usuarios
    const campoUsuariosInsertions = usuario_ids.map(usuario_id => ({
        campo_id: data.id,
        usuario_id
    }));

    const { error: campoUsuariosError } = await supabase
        .from('campo_usuarios')
        .insert(campoUsuariosInsertions);

    if (campoUsuariosError) {
        console.error("Error creando campo_usuarios:", campoUsuariosError);
        return { campo: null, success: false };
    }

    // Tercera inserción - campo_assets
    const campoAssetsInsertions = asset_assignments.map(assignment => ({
        campo_id: data.id,
        asset_id: assignment.asset_id,
        usuario_id: assignment.usuario_id
    }));

    const { error: campoAssetsError } = await supabase
        .from('campo_assets')
        .insert(campoAssetsInsertions);

    if (campoAssetsError) {
        console.error("Error creando campo_assets:", campoAssetsError);
        return { campo: null, success: false };
    }

    return { campo: data, success: true };
}

