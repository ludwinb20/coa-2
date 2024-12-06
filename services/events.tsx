import { Client, Encargados, Event, Event_file, Events_category } from "@/types/models";
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

export const updateEvent = async (event: Event, file?: File | null): Promise<Event> => {
    try {
        
        const { data: updatedEvent, error: eventError } = await supabase
            .from('events')
            .update(event)
            .eq('id', event.id)
            .select()
            .single();

        if (eventError) {
            throw new Error(eventError.message);
        }

      
        if (file) {
            let uploadedFile: string | null = null;
            const result = await uploadFile({
                bucket: "eventos",
                url: "eventos",
                file: file
            });
            
            if (result.success) {
                uploadedFile = result.data;
                
            
                const { error: fileError } = await supabase
                    .from('events_files')
                    .insert([{
                        evento_id: event.id,
                        file: uploadedFile
                    }]);

                if (fileError) {
                    console.error('Error al guardar el archivo:', fileError);
                }
            }
        }

        if (!updatedEvent) {
            throw new Error("Event update failed, no data returned.");
        }

        return updatedEvent as Event;
    } catch (error) {
        console.error('Error en updateEvent:', error);
        throw error;
    }
}

export const deleteEvent = async (id: number): Promise<void> => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
        throw new Error(error.message);
    }
}

export const createEventFile = async ({
    event_id,
    file
}: {
    event_id: number;
    file?: File;
}): Promise<{ eventFile: Event_file | null; success: boolean }> => {
    let uploadedFile: string | null = null;

    if (file) {
        const result = await uploadFile({
            bucket: "eventos",
            url: "eventos",
            file: file
        });
        if (result.success) uploadedFile = result.data;
    }

    const { data, error } = await supabase
        .from("events_files")
        .insert([
            {
                evento_id: event_id,
                file: uploadedFile,
            },
        ])
        .select()
        .single();

    if (error) {
        console.log("Error creating event file:", error);
        return { eventFile: null, success: false };
    }

    return { eventFile: data, success: true };
};

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


export const createEncargados = async (encargado: Encargados): Promise<{ success: boolean; data?: Encargados }> => {
    try {
       
        const encargadoData = {
            evento_id: Number(encargado.evento_id),
            usuario_id: encargado.usuario_id
        };

        const { data, error } = await supabase
            .from('events_encargados')
            .insert(encargadoData)
            .select();

        if (error) {
            console.error('Error en createEncargados:', error);
            return { success: false };
        }

        return { success: true, data: data[0] as Encargados };
    } catch (error) {
        console.error('Error en createEncargados:', error);
        return { success: false };
    }
}
