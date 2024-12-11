import { Project, ProjectCategory, Tarea } from "@/types/models";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from '@/utils/handle-files';

const supabase = createClient();

interface CreateTareaParams {
  nombre: string;
  descripcion: string;
  proyecto_id: number | null;
  creador: string;
  encargado: string;
  prioridad: 'baja' | 'media' | 'alta';
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
  fecha_inicio: Date;
  fecha_final: Date;
}

export const getTareas = async (): Promise<Tarea[]> => {
  const { data: tareas, error } = await supabase
    .from("tarea")
    .select(`
      *,
      profiles_encargado:encargado (
        id,
        full_name,
        avatar_url
      ),
      profiles_creador:creador (
        id,
        full_name,
        avatar_url
      )
    `)
    .order('fecha_inicio', { ascending: false });

  if (error) throw new Error(error.message);
  
  const tareasWithFilesAndAvatars = await Promise.all(
    tareas.map(async (tarea: Tarea) => {
      let avatarUrl = null;
      let creadorAvatarUrl = null;

      if (tarea.profiles_encargado?.avatar_url) {
        const { data: signedUrlData } = await supabase.storage
          .from("avatars")
          .createSignedUrl(`users/${tarea.profiles_encargado.avatar_url}`, 3600);
        avatarUrl = signedUrlData?.signedUrl;
      }

      if (tarea.profiles_creador?.avatar_url) {
        const { data: signedUrlData } = await supabase.storage
          .from("avatars")
          .createSignedUrl(`users/${tarea.profiles_creador.avatar_url}`, 3600);
        creadorAvatarUrl = signedUrlData?.signedUrl;
      }

      let fileUrl = null;
      if (tarea.file) {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from("tareas")
          .createSignedUrl(`tareas/${tarea.file}`, 3600);

        if (signedUrlError || !signedUrlData) {
          console.error(`Error creando URL firmada para el archivo ${tarea.file}:`, signedUrlError?.message);
        } else {
          fileUrl = signedUrlData.signedUrl;
        }
      }

      return { 
        ...tarea, 
        url: fileUrl, 
        avatarUrl,
        creadorAvatarUrl 
      };
    })
  );

  return tareasWithFilesAndAvatars;
};

export const createTarea = async (
  tarea: CreateTareaParams, 
  files?: File[]
): Promise<Tarea> => {
  const tareaData = {
    nombre: tarea.nombre,
    descripcion: tarea.descripcion,
    proyecto_id: tarea.proyecto_id,
    creador: tarea.creador,
    encargado: tarea.encargado,
    prioridad: tarea.prioridad,
    estado: tarea.estado,
    fecha_inicio: tarea.fecha_inicio.toISOString(),
    fecha_final: tarea.fecha_final.toISOString(),
  };

  // Insertar la tarea
  const { data: createdTarea, error: tareaError } = await supabase
    .from("tarea")
    .insert(tareaData)
    .select()
    .single();

  if (tareaError) {
    console.error("Error creating tarea:", tareaError);
    throw new Error(tareaError.message);
  }

  // Si hay archivos, subirlos y crear registros en tarea_files
  if (files && files.length > 0) {
    const filePromises = files.map(async (file) => {
      // Subir el archivo
      const result = await uploadFile({ 
        bucket: "tareas", 
        url: "tareas", 
        file: file 
      });

      if (!result.success || !result.data) {
        console.error(`Error uploading file ${file.name}`);
        return null;
      }

      // Crear registro en tarea_files
      const { error: fileError } = await supabase
        .from("tarea_files")
        .insert({
          tarea_id: createdTarea.id,
          file: result.data
        });

      if (fileError) {
        console.error(`Error creating file record: ${fileError.message}`);
        return null;
      }

      return result.data;
    });

    await Promise.all(filePromises);
  }

  return createdTarea as Tarea;
};

export const createTareaFile = async ({
  tarea_id,
  file
}: {
  tarea_id: number;
  file: File;
}): Promise<{ success: boolean; data?: string }> => {
  try {
    // Subir el archivo
    const uploadResult = await uploadFile({ 
      bucket: "tareas", 
      url: "tareas", 
      file: file 
    });

    if (!uploadResult.success || !uploadResult.data) {
      return { success: false };
    }

    // Crear registro en tarea_files
    const { error } = await supabase
      .from("tarea_files")
      .insert({
        tarea_id: tarea_id,
        file: uploadResult.data
      });

    if (error) {
      console.error("Error creating tarea file:", error);
      return { success: false };
    }

    return { success: true, data: uploadResult.data };
  } catch (error) {
    console.error("Error in createTareaFile:", error);
    return { success: false };
  }
};