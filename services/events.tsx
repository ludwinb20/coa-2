import { Client } from "@/types/models";
import { uploadFile } from "@/utils/handle-files";
import { createClient } from "@/utils/supabase/client";


const supabase = createClient();

export const getEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('events').select('*');
    if (error) {
        throw new Error(error.message);
    }
    return data as Event[];
}

