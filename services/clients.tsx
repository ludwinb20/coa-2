import { Client } from "@/types/clients";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getClients = async ({ empresa_id }: { empresa_id: number | null }): Promise<Client[]> => {
    console.log('Empresa ID:', empresa_id);
    if (!empresa_id) return [];
    
    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", empresa_id);

    console.log("Clientes:", data, "Error:", error);

    if (error) {
        console.log("Error fetching clients:", error.message);
        return [];
    }

    return data || [];
};

export const createClients = async ({ company_id, name, rtn }: { company_id: number, name: string, rtn: string }):
Promise<{ client: Client | null ; success: boolean }> =>  {
    // return {client: null, success: false};
    console.log({ company_id, name, rtn });
    const { data, error } = await supabase
        .from("clients")
        .insert([
            {
                company_id: company_id,
                name: name,
                rtn: rtn,
            },
        ]);

    console.log("Cliente creado:", data, "Error:", error);

    if (error) {
        console.log("Error creando cliente:", error);
        return {client: null, success: false};
    }

    return {client: data, success: true};
};

export const updateClient = async ({ id, name, rtn }: { id: number, name: string, rtn: string }):
Promise<{ client: Client | null ; success: boolean }> =>  {
    // return {client: null, success: false};
    console.log({ id, name, rtn });
    const { data, error } = await supabase
        .from("clients")
        .update({
            name: name,
            rtn: rtn,
        })
        .eq("id", id);

    console.log("Cliente actualizado:", data, "Error:", error);

    if (error) {
        console.log("Error actualizando cliente:", error);
        return {client: null, success: false};
    }

    return {client: data, success: true};
};
