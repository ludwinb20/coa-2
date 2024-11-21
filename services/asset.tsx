import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getAsset = async ({empresa_id}: {empresa_id: number | null}) => {
    console.log("Empresa ID:", empresa_id);
    if(!empresa_id) return [];
    const { data, error } = await supabase.from("asset").select("*").eq("company_id", empresa_id);
    console.log("Assets:", data, "Error:", error);
    if (error) {
        console.error("Error fetching Assets:", error);
        return [];
    }
    return data;
};