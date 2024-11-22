import { Client } from "@/types/clients";
import { uploadFile } from "@/utils/handle-files";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export const getClients = async ({
    empresa_id,
  }: {
    empresa_id: number | null;
  }): Promise<Client[]> => {
    if (!empresa_id) {
      console.warn("Empresa ID no proporcionado.");
      return [];
    }
  
    try {
      // Obtener clientes activos
      const { data: clients, error } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", empresa_id)
        .eq("active", true)
        .order("id", { ascending: true });
  
      if (error) {
        console.error("Error fetching clients:", error.message);
        return [];
      }
  
      if (!clients || clients.length === 0) {
        console.info("No se encontraron clientes.");
        return [];
      }
  
      // Mapear clientes con URLs firmadas para los archivos
      const clientsWithFiles = await Promise.all(
        clients.map(async (client: Client) => {
          if (!client.file) {
            return { ...client, url: null };
          }
  
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from("avatars")
            .createSignedUrl(`clients/${client.file}`, 3600);
  
          if (signedUrlError || !signedUrlData) {
            console.error(`Error creando URL firmada para el archivo ${client.file}:`, signedUrlError?.message);
            return { ...client, url: null };
          }
  
          return { ...client, url: signedUrlData.signedUrl };
        })
      );
  
      console.log(clientsWithFiles);
      return clientsWithFiles;
    } catch (error) {
      console.error("Error inesperado en getClients:", error);
      return [];
    }
  };
  

export const createClients = async ({
  company_id,
  name,
  rtn,
  file,
}: {
  company_id: number;
  name: string;
  rtn: string;
  file?: File;
}): Promise<{ client: Client | null; success: boolean }> => {
    console.log({company_id, name, rtn, file});
    let uploadedFile: string | null = null;
    if(file){
        const result = await uploadFile({bucket: "avatars", url: "clients", file: file});
        if(result.success) uploadedFile = result.data;
    }
  // return {client: null, success: false};
  const { data, error } = await supabase.from("clients").insert([
    {
      company_id: company_id,
      name: name,
      rtn: rtn,
      file: uploadedFile,
    },
  ]);

  console.log("Cliente creado:", data, "Error:", error);

  if (error) {
    console.log("Error creando cliente:", error);
    return { client: null, success: false };
  }

  return { client: data, success: true };
};

export const updateClient = async ({
  id,
  name,
  rtn,
  file
}: {
  id: number;
  name: string;
  rtn: string;
  file: File | string | null;
}): Promise<{ client: Client | null; success: boolean }> => {

    let filefiltrado: string | null = null;
    if(!file || typeof file === "string"){
        filefiltrado = file;
    }else{
        const result = await uploadFile({bucket: "avatars", url: "clients", file: file});
        if(result.success) filefiltrado = result.data;
    }


  const { data, error } = await supabase
    .from("clients")
    .update({
      name: name,
      rtn: rtn,
      file: filefiltrado
    })
    .eq("id", id);

  console.log("Cliente actualizado:", data, "Error:", error);

  if (error) {
    console.log("Error actualizando cliente:", error);
    return { client: null, success: false };
  }

  return { client: data, success: true };
};

export const deleteCliente = async ({
  id,
}: {
  id: number;
}): Promise<{ client: Client | null; success: boolean }> => {
  // return {client: null, success: false};
  console.log({ id });
  const { data, error } = await supabase
    .from("clients")
    .update({
        active: false
    })
    .eq("id", id);

  console.log("Cliente eliminado:", data, "Error:", error);

  if (error) {
    console.log("Error eliminando cliente:", error);
    return { client: null, success: false };
  }

  return { client: data, success: true };
};
