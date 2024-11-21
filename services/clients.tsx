import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const getClients = async ({empresa_id}: {empresa_id: number | null}) => {
    if(!empresa_id) return [];
    const { data, error } = await supabase.from("clients").select("*").eq("company_id", empresa_id);
    console.log("Clientes:", data, "Error:", error);
    if (error) {
        console.error("Error fetching clients:", error);
        return [];
    }
    return data;
};