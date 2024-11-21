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
