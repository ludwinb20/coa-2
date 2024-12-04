'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Event as EventType } from '@/types/models';
import { getEvents } from '@/services/events';



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
        categoria_id: string;
        creador_evento: number;
        client_id: number;
        encargados: string;
    };
}

export default function EventsCalendar() {
    const [events, setEvents] = useState<FormattedEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<FormattedEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventData: EventType[] = await getEvents();
                const formattedEvents: FormattedEvent[] = eventData.map(event => ({
                    id: event.id.toString(),
                    title: event.nombre,
                    start: event.fecha_inicio,
                    end: event.fecha_final,
                    extendedProps: {
                        categoria_id: event.categoria_id,
                        creador_evento: event.creador_evento,
                        client_id: event.client_id,
                        encargados: event.encargados
                    }
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error al cargar eventos:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleEventClick = (info: any) => {
        const eventId = info.event.id;
        const event = events.find(e => e.id === eventId);
        if (event) {
            setSelectedEvent(event);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="h-screen p-4">
            <FullCalendar
                plugins={[dayGridPlugin]}
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
            />

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    {selectedEvent && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedEvent.title}</DialogTitle>
                                <DialogDescription>
                                    Detalles del evento
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                <p><strong>Fecha de inicio:</strong> {new Date(selectedEvent.start).toLocaleString('es-ES')}</p>
                                <p><strong>Fecha de finalización:</strong> {new Date(selectedEvent.end).toLocaleString('es-ES')}</p>
                                <p><strong>ID del Cliente:</strong> {selectedEvent.extendedProps.client_id}</p>
                                <p><strong>Encargados:</strong> {selectedEvent.extendedProps.encargados}</p>
                                <p><strong>Categoría ID:</strong> {selectedEvent.extendedProps.categoria_id}</p>
                                <p><strong>Creador del evento:</strong> {selectedEvent.extendedProps.creador_evento}</p>
                            </div>
                            <DialogFooter>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cerrar
                                </button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}