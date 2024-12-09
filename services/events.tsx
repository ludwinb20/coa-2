import { Client, Encargados, Event, Event_file, Events_category } from "@/types/models";
import { uploadFile } from "@/utils/handle-files";
import { createClient } from "@/utils/supabase/client";



const supabase = createClient();

export const getEvents = async (): Promise<Event[]> => {
    try {
        const { data: events, error } = await supabase
            .from('events')
            .select(`
                *,
                profiles:creador_evento (
                    full_name
                ),
                clients:client_id (
                    id,
                    name,
                    file
                ),
                campo (
                    *
                )
            `);

        if (error) {
            console.error('Error fetching events:', error);
            return [];
        }

        const eventsWithClientUrls = await Promise.all(
            (events || []).map(async (event) => {
                if (!event.clients?.file) {
                    return {
                        ...event,
                        clients: event.clients ? { ...event.clients, url: null } : null,
                        campo: event.campo || null
                    };
                }

                const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                    .from("avatars")
                    .createSignedUrl(`clients/${event.clients.file}`, 3600);

                if (signedUrlError || !signedUrlData) {
                    console.error(`Error creando URL firmada para el archivo ${event.clients.file}:`, signedUrlError?.message);
                    return {
                        ...event,
                        clients: { ...event.clients, url: null },
                        campo: event.campo || null
                    };
                }

                return {
                    ...event,
                    clients: {
                        ...event.clients,
                        url: signedUrlData.signedUrl
                    },
                    campo: event.campo || null
                };
            })
        );

        return eventsWithClientUrls;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
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

export const getEncargados = async (evento_id: number): Promise<Encargados[]> => { 
    try {
        const { data, error } = await supabase
            .from('events_encargados')
            .select(`
                *,
                profiles:usuario_id (
                    id,
                    full_name,
                    avatar_url
                )
            `)
            .eq('evento_id', evento_id);
        
        if (error) {
            throw new Error(error.message);
        }

        // Procesar las URLs de los avatares
        const encargadosWithUrls = await Promise.all(
            (data || []).map(async (encargado) => {
                if (!encargado.profiles?.avatar_url) {
                    return {
                        ...encargado,
                        profiles: {
                            ...encargado.profiles,
                            url: null
                        }
                    };
                }

                const { data: signedUrlData, error: signedUrlError } = 
                    await supabase.storage
                        .from("avatars")
                        .createSignedUrl(`users/${encargado.profiles.avatar_url}`, 3600);

                if (signedUrlError || !signedUrlData) {
                    console.error(
                        `Error creating signed URL for ${encargado.profiles.avatar_url}:`,
                        signedUrlError?.message
                    );
                    return {
                        ...encargado,
                        profiles: {
                            ...encargado.profiles,
                            url: null
                        }
                    };
                }

                return {
                    ...encargado,
                    profiles: {
                        ...encargado.profiles,
                        url: signedUrlData.signedUrl
                    }
                };
            })
        );
        
        return encargadosWithUrls;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}   

interface EventFile {
    id: number;
    url: string;
    name: string;
    type: string;
}

export const getEventFiles = async (event_id: number): Promise<EventFile[]> => {
    try {
        const { data: files, error } = await supabase
            .from('events_files')
            .select('*')
            .eq('evento_id', event_id);

        if (error) {
            console.error('Error fetching event files:', error);
            return [];
        }

        if (!files || files.length === 0) {
            console.log('No files found for event:', event_id);
            return [];
        }

        console.log('Raw files from database:', JSON.stringify(files, null, 2));

        const filesWithUrls = await Promise.all(
            files.map(async (file) => {
                if (!file.file) {
                    console.log('File record has no file path:', file);
                    return null;
                }

                try {
                    // Construir la ruta completa incluyendo la carpeta
                    const filePath = `eventos/${file.file}`;
                    console.log('Attempting to get signed URL for path:', filePath);

                    const { data: signedUrlData, error: signedUrlError } = await supabase
                        .storage
                        .from('eventos')
                        .createSignedUrl(filePath, 3600);

                    if (signedUrlError || !signedUrlData) {
                        console.error(`Error creating signed URL for file ${filePath}:`, signedUrlError?.message);
                        return null;
                    }

                    const fileName = file.file;
                    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';

                    return {
                        id: Number(file.id),
                        url: signedUrlData.signedUrl,
                        name: fileName,
                        type: fileExtension
                    };
                } catch (error) {
                    console.error('Error processing file:', {
                        file: file.file,
                        error: error
                    });
                    return null;
                }
            })
        );

        const validFiles = filesWithUrls.filter((file): file is EventFile => file !== null);
        
        console.log('Final processed files:', validFiles);
        console.log('Number of valid files:', validFiles.length);

        return validFiles;
    } catch (error) {
        console.error('Error in getEventFiles:', error);
        return [];
    }
};

// Función auxiliar para determinar el tipo de archivo
function getFileType(extension: string): string {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
    const videoExtensions = ['mp4', 'avi', 'mov'];

    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (documentExtensions.includes(extension)) {
        return 'document';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    } else {
        return 'other';
    }
}

export const deleteEventFile = async (id: number): Promise<void> => {
    const { error } = await supabase.from('events_files').delete().eq('id', id);
    if (error) {
        throw new Error(error.message);
    }
}
