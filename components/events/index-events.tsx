'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Event as EventType } from '@/types/models';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/services/events';



import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

type FormattedEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    extendedProps: {
        categoria: string;
        creador_evento: number;
        client_id: number;
        notas: string;
    };
}

export default function EventsCalendar() {
    const [events, setEvents] = useState<FormattedEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<FormattedEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newEvent, setNewEvent] = useState({
        nombre: '',
        fecha_inicio: '',
        fecha_final: '',
        categoria: '',
        creador_evento: 0,
        client_id: 0,
        notas: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingEvent, setEditingEvent] = useState({
        nombre: '',
        fecha_inicio: '',
        fecha_final: '',
        categoria: '',
        creador_evento: 0,
        client_id: 0,
        notas: ''
    });

    const fetchEvents = async () => {
        try {
            const eventData: EventType[] = await getEvents();
            const formattedEvents: FormattedEvent[] = eventData.map(event => ({
                id: event.id ? event.id.toString() : '',
                title: event.nombre,
                start: event.fecha_inicio,
                end: event.fecha_final,
                extendedProps: {
                    categoria: event.categoria,
                    creador_evento: event.creador_evento,
                    client_id: event.client_id,
                    notas: event.notas
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

    const handleEventClick = (info: any) => {
        const eventId = info.event.id;
        if (!eventId) {
            console.error('Event ID is undefined');
            return;
        }
        const event = events.find(e => e.id === eventId);
        if (event) {
            setSelectedEvent(event);
            setIsModalOpen(true);
        }
    };

    const handleDateClick = (info: any) => {
        const selectedDate = new Date(info.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetear la hora a medianoche

        if (selectedDate < today) {
            // Si la fecha es anterior a hoy, no hacemos nada
            return;
        }

        // Si la fecha es hoy o posterior, mostramos el modal
        setSelectedDate(selectedDate);
        setIsCreateModalOpen(true);
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Establecer la hora a medianoche para comparar solo la fecha

        const startDate = new Date(newEvent.fecha_inicio);
        if (startDate < today) {
            alert("No se pueden crear eventos en fechas anteriores a hoy.");
            return;
        }

        try {
            const eventData: EventType = {
                ...newEvent,
                fecha_inicio: startDate,
                fecha_final: new Date(newEvent.fecha_final)
            };

            await createEvent(eventData);
            setIsCreateModalOpen(false);
            fetchEvents();
        } catch (error) {
            console.error('Error al crear evento:', error);
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

            await updateEvent(eventData);
            setIsEditing(false);
            setIsModalOpen(false);
            fetchEvents();
        } catch (error) {
            console.error('Error al actualizar evento:', error);
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;

        if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            try {
                await deleteEvent(parseInt(selectedEvent.id));
                setIsModalOpen(false);
                fetchEvents();
            } catch (error) {
                console.error('Error al eliminar evento:', error);
            }
        }
    };

    const handleDialogChange = (open: boolean) => {
        if (!open) {
            setIsModalOpen(false);
            setIsEditing(false); // Resetear el modo de edición
            setEditingEvent({    // Resetear el formulario
                nombre: '',
                fecha_inicio: '',
                fecha_final: '',
                categoria: '',
                creador_evento: 0,
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
            />

            <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
                <DialogContent className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                    {selectedEvent && !isEditing ? (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-gray-800">{selectedEvent.title}</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500">
                                    Detalles del evento
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 mt-4">
                                <p><strong>Fecha de inicio:</strong> {new Date(selectedEvent.start).toLocaleString('es-ES')}</p>
                                <p><strong>Fecha de finalización:</strong> {new Date(selectedEvent.end).toLocaleString('es-ES')}</p>
                                <p><strong>ID del Cliente:</strong> {selectedEvent.extendedProps.client_id}</p>
                                <p><strong>Categoría :</strong> {selectedEvent.extendedProps.categoria}</p>
                                <p><strong>Creador del evento:</strong> {selectedEvent.extendedProps.creador_evento}</p>
                            </div>
                            <DialogFooter className="mt-6 space-x-2">
                                <button
                                    onClick={handleEditClick}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={handleDeleteEvent}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
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
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Fecha de Inicio</label>
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
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Fecha de Finalización</label>
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

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Evento</DialogTitle>
                        <DialogDescription>
                            Ingrese los detalles del nuevo evento
                        </DialogDescription>
                    </DialogHeader>
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
                        <div>
                            <label className="block text-sm font-medium mb-1">ID del Cliente</label>
                            <input
                                type="number"
                                value={newEvent.client_id}
                                onChange={(e) => setNewEvent({ ...newEvent, client_id: parseInt(e.target.value) })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Categoría</label>
                            <input
                                type="text"
                                value={newEvent.categoria}
                                onChange={(e) => setNewEvent({ ...newEvent, categoria: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
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
                        <div>
                            <label className="block text-sm font-medium mb-1">Fecha de Inicio</label>
                            <input
                                type="datetime-local"
                                value={newEvent.fecha_inicio}
                                onChange={(e) => setNewEvent({ ...newEvent, fecha_inicio: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Fecha de Finalización</label>
                            <input
                                type="datetime-local"
                                value={newEvent.fecha_final}
                                onChange={(e) => setNewEvent({ ...newEvent, fecha_final: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Crear Evento
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}