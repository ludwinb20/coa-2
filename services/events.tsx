import { Client, Event, Events_category } from "@/types/models";
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

export const getCategories = async ({}: {
    }): Promise<Events_category[]> => {
    const { data, error } = await supabase
        .from("events_category")
        .select("*")
        .order("id", {
            ascending: true,
        });
    if (error) {
        console.error("Error fetching Categories:", error);
        return [];
    }
    return data;
};

export const createCategoryEvents = async (category: Events_category): Promise<{ success: boolean; data?: Events_category }> => {
    try {
        const { data, error } = await supabase.from('events_category').insert(category).select();
        if (error) {
            return { success: false };
        }
        return { 
            success: true, 
            data: data[0] as Events_category 
        };
    } catch (error) {
        return { success: false };
    }
};

export const updateCategoryEvents = async (category: Events_category): Promise<{ success: boolean; data?: Events_category }> => {
    try {
        const { data, error } = await supabase.from('events_category').update(category).eq('id', category.id).select();
        if (error) {
            return { success: false };
        }
        return { success: true, data: data[0] as Events_category };
    } catch (error) {
        return { success: false };
    }
}

export const deleteCategoryEvents = async (id: number): Promise<void> => {
    const { error } = await supabase.from('events_category').delete().eq('id', id);
    if (error) {
        throw new Error(error.message);
    }
}
