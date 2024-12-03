import { Asset } from "@/types/asset";
import { Campo, CampoAssets, Campologs, CampoUsuarios, Incidencia } from "@/types/models";
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

export const acceptCampo = async (id: number): Promise<{ campo: Campo | null; success: boolean }> => {
    const { data, error } = await supabase.from('campo').update({ estado: 'Aceptado' }).eq('id', id);
    
    if (error) {
        console.error("Error aceptando campo:", error);
        return { campo: null, success: false };
    }

    return { campo: data, success: true };
}

export const rejectCampo = async (id: number ,motivo: string): Promise<{ campo: Campo | null; success: boolean }> => {
    const { data, error } = await supabase.from('campo').update({ estado: 'rechazado', observacion: motivo }).eq('id', id);

    if (error) {
        console.error("Error rechazando campo:", error);
        return { campo: null, success: false };
    }

    return { campo: data, success: true };
}

export const completeCampo = async (id: number): Promise<{ campo: Campo | null; success: boolean }> => {
    const { data, error } = await supabase.from('campo').update({ estado: 'Completado' }).eq('id', id);

    if (error) {
        console.error("Error completando campo:", error);
        return { campo: null, success: false };
    }

    return { campo: data, success: true };
}

export const newLog = async (id: number, evento: string,asset_id: number,usuario_id: UUID,observaciones: string): Promise<{ campo: Campologs | null; success: boolean }> => {
    const { data, error } = await supabase.from('campo_logs').insert({ campo_id: id, evento,asset_id,usuario_id,observaciones });

    const { data: assetData, error: assetError } = await supabase.from('campo_assets').update({ estado: 'Entregado' }).eq('id', asset_id);

    if (error) {
        console.error("Error creando log:", error);
        return { campo: null, success: false };
    }

    return { campo: data, success: true };
}


export const createIncidencia = async ({
    campo_id,
    asset_id,
    file
  }: {
    campo_id: number;
    asset_id: number;
    file?: File;
  }): Promise<{ incidencia: Incidencia | null; success: boolean }> => {
    console.log({ campo_id, asset_id });
    
    let uploadedFile: string | null = null;
    if (file) {
      const result = await uploadFile({ 
        bucket: "incidencias", 
        url: "incidencias", 
        file: file 
      });
      if (result.success) uploadedFile = result.data;
    }
  
    const { data, error } = await supabase.from("campo_file_observaciones").insert([
      {
        campo_id: campo_id,
        asset_id: asset_id,
        file: uploadedFile,
      },
    ]).select().single();
  
    if (error) {
      console.log("Error creando incidencia:", error);
      return { incidencia: null, success: false };
    }
  
    return { incidencia: data, success: true };
  };