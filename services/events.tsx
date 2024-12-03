import { Client, Event } from "@/types/models";
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

export const createEvent = async (event: Event): Promise<Event> => {
    const { data, error } = await supabase.from('events').insert(event);
    if (error) {
        throw new Error(error.message);
    }
    if (data === null) {
        throw new Error("Event creation failed, no data returned.");
    }
    return data as Event;
}
