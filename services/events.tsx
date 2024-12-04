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
    const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select();

    if (error) {
        throw new Error(error.message);
    }
    if (data === null || data.length === 0) {
        throw new Error("Event creation failed, no data returned.");
    }
    return data[0] as Event;
}

export const updateEvent = async (event: Event): Promise<Event> => {
    const { data, error } = await supabase
        .from('events')
        .update(event)
        .eq('id', event.id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }
    if (data === null) {
        throw new Error("Event update failed, no data returned.");
    }
    return data as Event;
}

export const deleteEvent = async (id: number): Promise<void> => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
        throw new Error(error.message);
    }
}

