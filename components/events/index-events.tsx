'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Encargados, Event as EventType } from '@/types/models';
import { getEvents, createEvent, updateEvent, deleteEvent, createEventFile, createEncargados } from '@/services/events';
import Dropzone from '@/components/ui/dropzone';
import { getCategories } from '@/services/events';
import { Events_category } from '@/types/models';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@radix-ui/react-label';
import MultiSelectUsuarios from '../salidas/create/multi-select';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getClients } from '@/services/clients';
import { Client } from '@/types/models';
import { useSession } from '@/app/session-provider';
import { toast } from 'sonner';

type FormattedEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    extendedProps: {
        categoria: string;
        creador_evento: string;
        creador_nombre: string;
        client_id: number;
        notas: string;
        fecha_final: Date;
    };
}

export default function EventsCalendar() {
    const { user } = useSession();
    const [events, setEvents] = useState<FormattedEvent[]>([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<FormattedEvent | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newEvent, setNewEvent] = useState({
        nombre: '',
        fecha_inicio: '',
        fecha_final: '',
        categoria: '',
        creador_evento: '',
        client_id: 0,
        notas: '',
        });
    const [isEditing, setIsEditing] = useState(false);
    const [editingEvent, setEditingEvent] = useState({
        nombre: '',
        fecha_inicio: '',
        fecha_final: '',
        categoria: '',
        creador_evento: '',
        client_id: 0,
        notas: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [editingFile, setEditingFile] = useState<File | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [categories, setCategories] = useState<Events_category[]>([]);
    const [fileUploads, setFileUploads] = useState<Array<{ id: number, file: File | null }>>([
        { id: 1, file: null }
    ]);
    const [clients, setClients] = useState<Client[]>([]);

    const initialNewEventState = {
        nombre: '',
        fecha_inicio: '',
        fecha_final: '',
        categoria: '',
        creador_evento: '',
        client_id: 0,
        notas: '',
    };

    useEffect(() => {
        if (!user?.id) {
            toast.error("Debe iniciar sesión para crear eventos");
            return;
        }
    }, [user]);

    const fetchEvents = async () => {
        try {
            const eventData: EventType[] = await getEvents();
            const formattedEvents: FormattedEvent[] = eventData.map(event => ({
                id: event.id ? event.id.toString() : '',
                title: event.nombre,
                start: new Date(event.fecha_inicio),
                end: new Date(event.fecha_inicio),
                allDay: true,
                extendedProps: {
                    categoria: event.categoria,
                    creador_evento: event.creador_evento,
                    creador_nombre: event.profiles?.full_name || 'Usuario Desconocido',
                    client_id: event.client_id,
                    notas: event.notas,
                    fecha_final: new Date(event.fecha_final)
                }
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error al cargar eventos:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesData = await getCategories({});
            setCategories(categoriesData);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchClients = async () => {
            if (user?.empresa?.id) {
                const clientsData = await getClients({ empresa_id: user.empresa.id });
                setClients(clientsData);
            }
        };

        fetchClients();
    }, [user?.empresa?.id]);

    const handleEventClick = (info: any) => {
        info.jsEvent.preventDefault();
        const eventId = info.event.id;
        if (!eventId) {
            console.error('Event ID is undefined');
            return;
        }
        const event = events.find(e => e.id === eventId);
        if (event) {
            setSelectedEvent(event);
            setIsViewModalOpen(true);
            setIsCreateModalOpen(false);
        }
    };

    const handleDateClick = (info: any) => {
        info.jsEvent.preventDefault();
        const selectedDate = new Date(info.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return;
        }

        setSelectedEvent(null);
        setIsViewModalOpen(false);
        
        setSelectedDate(selectedDate);
        setIsCreateModalOpen(true);
        setNewEvent({
            ...newEvent,
            fecha_inicio: selectedDate.toISOString().slice(0, 16),
            fecha_final: selectedDate.toISOString().slice(0, 16)
        });
    };

    const addFileUpload = () => {
        const newId = fileUploads.length + 1;
        setFileUploads([...fileUploads, { id: newId, file: null }]);
    };

    const removeFileUpload = (id: number) => {
        if (fileUploads.length > 1) {
            setFileUploads(fileUploads.filter(upload => upload.id !== id));
        }
    };

    const handleFileChange = (id: number, file: File | null) => {
        setFileUploads(fileUploads.map(upload => 
            upload.id === id ? { ...upload, file } : upload
        ));
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user?.id) {
            toast.error("Debe iniciar sesión para crear eventos");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(newEvent.fecha_inicio);
        if (startDate < today) {
            alert("No se pueden crear eventos en fechas anteriores a hoy.");
            return;
        }

        try {
            const eventData = {
                nombre: newEvent.nombre,
                fecha_inicio: startDate,
                fecha_final: new Date(newEvent.fecha_final),
                categoria: newEvent.categoria,
                creador_evento: user.id.toString(),
                client_id: newEvent.client_id || 0,
                notas: newEvent.notas
            };

            const createdEvent = await createEvent(eventData);

            if (createdEvent?.id) {
                const eventoId = createdEvent.id;

                const encargadosPromises = selectedUsers.map(async (userId) => {
                    try {
                        const encargadoData: Encargados = {
                            evento_id: eventoId,
                            usuario_id: userId
                        };
                        
                        const { success } = await createEncargados(encargadoData);
                        if (!success) {
                            console.error(`Error al asignar encargado ${userId}`);
                        }
                    } catch (error) {
                        console.error(`Error al procesar encargado ${userId}:`, error);
                    }
                });

                await Promise.all(encargadosPromises);

                const filesPromises = fileUploads
                    .filter(upload => upload.file !== null)
                    .map(async (upload) => {
                        if (upload.file) {
                            const { success } = await createEventFile({
                                event_id: eventoId,
                                file: upload.file
                            });

                            if (!success) {
                                console.error(`Error al subir archivo: ${upload.file.name}`);
                            }
                        }
                    });

                await Promise.all(filesPromises);

                setIsCreateModalOpen(false);
                fetchEvents();
                setNewEvent({
                    ...initialNewEventState,
                    creador_evento: user.id.toString()
                });
                setSelectedUsers([]);
                setFileUploads([{ id: 1, file: null }]);
            }

        } catch (error) {
            console.error('Error al crear evento:', error);
            toast.error("Error al crear el evento");
        }
    };

    const handleEditClick = () => {
        if (selectedEvent) {
            setEditingEvent({
                nombre: selectedEvent.title,
                fecha_inicio: new Date(selectedEvent.start).toISOString().slice(0, 16),
                fecha_final: new Date(selectedEvent.end).toISOString().slice(0, 16),
                categoria: selectedEvent.extendedProps.categoria,
                creador_evento: selectedEvent.extendedProps.creador_evento,
                client_id: selectedEvent.extendedProps.client_id,
                notas: selectedEvent.extendedProps.notas
            });
            setIsEditing(true);
        }
    };

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent) return;

        try {
            const eventData: EventType = {
                id: parseInt(selectedEvent.id),
                ...editingEvent,
                fecha_inicio: new Date(editingEvent.fecha_inicio),
                fecha_final: new Date(editingEvent.fecha_final)
            };

            await updateEvent(eventData, editingFile);
            setIsEditing(false);
            setIsViewModalOpen(false);
            fetchEvents();
            setEditingFile(null);

        } catch (error) {
            console.error('Error al actualizar evento:', error);
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;

        if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            try {
                await deleteEvent(parseInt(selectedEvent.id));
                setIsViewModalOpen(false);
                fetchEvents();
            } catch (error) {
                console.error('Error al eliminar evento:', error);
            }
        }
    };

    const handleDialogChange = (open: boolean) => {
        if (!open) {
            setIsViewModalOpen(false);
            setIsEditing(false); 
            setEditingEvent({    
                nombre: '',
                fecha_inicio: '',
                fecha_final: '',
                categoria: '',
                creador_evento: '',
                client_id: 0,
                notas: ''
            });
        }
    };

    return (
        <div className="h-screen p-4">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="100%"
                locale="en"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay'
                }}
                eventDisplay="block"
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                    hour12: false
                }}
                eventDidMount={(info) => {
                    info.el.style.fontSize = '0.85em';
                }}
                dayHeaderFormat={{
                    weekday: 'long'
                }}
                titleFormat={{
                    month: 'long',
                    year: 'numeric'
                }}
                buttonText={{
                    today: 'Today',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day'
                }}
                firstDay={1}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                selectable={true}
                displayEventEnd={false}
            />

            <Dialog 
                open={isViewModalOpen} 
                onOpenChange={(open) => {
                    setIsViewModalOpen(open);
                    if (!open) {
                        setIsEditing(false);
                        setSelectedEvent(null);
                        setEditingEvent({
                            nombre: '',
                            fecha_inicio: '',
                            fecha_final: '',
                            categoria: '',
                            creador_evento: '',
                            client_id: 0,
                            notas: ''
                        });
                        setEditingFile(null);
                        setSelectedUsers([]);
                    }
                }}
            >
                <DialogContent className="max-w-[800px] w-full">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Editar Evento" : "Detalles del Evento"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing ? "Modifique los detalles del evento" : "Información del evento"}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEvent && !isEditing ? (
                        <>
                        <DialogHeader className="border-b pb-4">
                            <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                                {selectedEvent.title}
                            </DialogTitle>
                            
                        </DialogHeader>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Fecha de inicio</p>
                                    <p className="font-medium text-gray-800">
                                        {new Date(selectedEvent.start).toLocaleString('es-ES', {
                                            dateStyle: 'full',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Fecha de finalización</p>
                                    <p className="font-medium text-gray-800">
                                        {new Date(selectedEvent.end).toLocaleString('es-ES', {
                                            dateStyle: 'full',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">ID del Cliente</span>
                                    <span className="font-semibold text-gray-800">
                                        {selectedEvent.extendedProps.client_id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Categoría</span>
                                    <span className="font-semibold text-gray-800">
                                        {selectedEvent.extendedProps.categoria}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Creador del evento</span>
                                    <span className="font-semibold text-gray-800">
                                        {selectedEvent.extendedProps.creador_nombre}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Notas</p>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[100px]">
                                    <p className="text-gray-800">
                                        {selectedEvent.extendedProps.notas || 'Sin notas adicionales'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="border-t pt-4 px-6 pb-6 flex justify-end space-x-3">
                            <button
                                onClick={handleEditClick}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 ease-in-out shadow-md"
                            >
                                Editar
                            </button>
                            <button
                                onClick={handleDeleteEvent}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 ease-in-out shadow-md"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                            >
                                Cerrar
                            </button>
                        </DialogFooter>
                    </>
                    ) : (
                        <form onSubmit={handleUpdateEvent} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold dark:text-gray-100">Editar Evento</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    Modifica los detalles del evento
                                </DialogDescription>
                            </DialogHeader>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Nombre del Evento</label>
                                <input
                                    type="text"
                                    value={editingEvent.nombre}
                                    onChange={(e) => setEditingEvent({ ...editingEvent, nombre: e.target.value })}
                                    className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 
                                             dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                                             focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">ID del Cliente</label>
                                <input
                                    type="number"
                                    value={editingEvent.client_id}
                                    onChange={(e) => setEditingEvent({ ...editingEvent, client_id: parseInt(e.target.value) })}
                                    className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 
                                             dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                                             focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label>Fecha de Inicio</Label>
                                    <input
                                        type="datetime-local"
                                        value={editingEvent.fecha_inicio}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, fecha_inicio: e.target.value })}
                                        className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 
                                                 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                                                 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label>Fecha de Finalización</Label>
                                    <input
                                        type="datetime-local"
                                        value={editingEvent.fecha_final}
                                        onChange={(e) => setEditingEvent({ ...editingEvent, fecha_final: e.target.value })}
                                        className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 
                                                 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                                                 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Archivo</Label>
                                <Dropzone
                                    onDrop={(files) => setEditingFile(files[0])}
                                    onDelete={() => setEditingFile(null)}
                                    className="bg-blue-100 border-2 border-dotted border-gray-300 rounded-lg py-4 px-6 text-center text-xs"
                                    text="Arrastre una imagen o archivo aquí o haga click para seleccionar"
                                />
                                {editingFile && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Archivo seleccionado: {editingFile.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label>Categoría</Label>
                                <Select 
                                    value={editingEvent.categoria}
                                    onValueChange={(value) => 
                                        setEditingEvent({ ...editingEvent, categoria: value })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem 
                                                key={category.id} 
                                                value={category.nombre}
                                            >
                                                {category.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 
                                             dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 
                                             transition-colors duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 
                                             dark:bg-blue-600 dark:hover:bg-blue-700 
                                             transition-colors duration-200"
                                >
                                    Guardar Cambios
                                </button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog 
                open={isCreateModalOpen} 
                onOpenChange={(open) => {
                    if (!open) {
                        setNewEvent(initialNewEventState);
                        setSelectedUsers([]);
                        setFileUploads([{ id: 1, file: null }]);
                        setIsCreateModalOpen(false);
                    } else {
                        setIsCreateModalOpen(true);
                    }
                }}
            >
                <DialogContent className="max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
                        <DialogTitle>Crear Nuevo Evento</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre del Evento</label>
                                <input
                                    type="text"
                                    value={newEvent.nombre}
                                    onChange={(e) => setNewEvent({ ...newEvent, nombre: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cliente</Label>
                                <Select
                                    value={newEvent.client_id ? newEvent.client_id.toString() : undefined}
                                    onValueChange={(value) => 
                                        setNewEvent({ 
                                            ...newEvent, 
                                            client_id: value ? parseInt(value) : 0
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccionar cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map((client) => (
                                            <SelectItem 
                                                key={client.id} 
                                                value={client.id.toString()}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {client.url && (
                                                        <img 
                                                            src={client.url} 
                                                            alt={client.name}
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                    )}
                                                    <span>{client.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Encargados</Label>
                                <MultiSelectUsuarios 
                                    selectedUsers={selectedUsers} 
                                    onChange={setSelectedUsers} 
                                />
                            </div>
                            <div>
                                <Label>Categoría</Label>
                                <Select 
                                    value={newEvent.categoria}
                                    onValueChange={(value) => 
                                        setNewEvent({ ...newEvent, categoria: value })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem 
                                                key={category.id} 
                                                value={category.nombre}
                                            >
                                                {category.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Notas</label>
                                <textarea
                                    value={newEvent.notas}
                                    onChange={(e) => setNewEvent({ ...newEvent, notas: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label>Fecha de Inicio</Label>
                                    <input
                                        type="datetime-local"
                                        value={newEvent.fecha_inicio}
                                        onChange={(e) => setNewEvent({ ...newEvent, fecha_inicio: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label>Fecha de Finalización</Label>
                                    <input
                                        type="datetime-local"
                                        value={newEvent.fecha_final}
                                        onChange={(e) => setNewEvent({ ...newEvent, fecha_final: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>

                        <div className="space-y-4">
                            <Label>Archivos</Label>
                            {fileUploads.map((upload) => (
                                <div key={upload.id} className="relative">
                                    <Dropzone
                                        onDrop={(files) => handleFileChange(upload.id, files[0])}
                                        onDelete={() => handleFileChange(upload.id, null)}
                                        className="bg-blue-100 border-2 border-dotted border-gray-300 rounded-lg py-4 px-6 text-center text-xs"
                                        text="Arrastre una imagen o archivo aquí o haga click para seleccionar"
                                    />
                                    {upload.file && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Archivo seleccionado: {upload.file.name}
                                        </p>
                                    )}
                                    {fileUploads.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFileUpload(upload.id)}
                                            className="absolute -right-2 -top-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addFileUpload}
                                className="w-full mt-2"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar otro archivo
                            </Button>
                        </div>

                            <div className="sticky bottom-0 bg-white pt-4 border-t">
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setNewEvent(initialNewEventState);
                                            setSelectedUsers([]);
                                            setFileUploads([{ id: 1, file: null }]);
                                            setIsCreateModalOpen(false);
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit">
                                        Crear Evento
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}