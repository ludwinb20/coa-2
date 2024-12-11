import { AbsenceCategory, Ausencia } from "@/types/models";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export const getAusencias = async (id: string | null, rol_id: number | null):Promise<Ausencia[]> => {
  try {
    if (!id || !rol_id) {
      console.log("Empresa ID o rol ID no proporcionado.");
      return [];
    }

    if ([1,2].includes(rol_id)) {
        const { data, error } = await supabase
          .from("ausencias")
          .select("*")
          .limit(100)
          .order("created_at", { ascending: false });
  
        if (error) {
          console.error("Error fetching ausencias:", error.message);
          return [];
        }
  
        if (!data || data.length === 0) {
          console.info("No ausencias found. 1", data);
          return [];
        }
        return data;
    }


    if ([3,4,6].includes(rol_id)) {
        const { data, error } = await supabase
          .from("ausencias")
          .select("*")
          .eq("user_id", id)
          .limit(100)
          .order("created_at", { ascending: false });
  
        if (error) {
          console.error("Error fetching ausencias:", error.message);
          return [];
        }
  
        if (!data || data.length === 0) {
          console.info("No ausencias found. 2");
          return [];
        }
        return data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching ausencias:", error);
    return [];
  }
};

export const getAbsenceCategories = async (): Promise<AbsenceCategory[]> => {
  try {
    const { data, error } = await supabase
      .from("ausencia_categorias")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching absence categories:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.info("No absence categories found.");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching absence categories:", error);
    return [];
  }
};