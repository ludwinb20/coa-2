'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Event as EventType } from '@/types/models';
import { getEvents } from '@/services/events';


type FormattedEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    extendedProps: {
        categoria_id: string;
        creador_evento: number;
    };
}

export default function EventsCalendar() {
    const [events, setEvents] = useState<FormattedEvent[]>([]);

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
                        creador_evento: event.creador_evento
                    }
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error al cargar eventos:', error);
            }
        };

        fetchEvents();
    }, []);

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
            />
        </div>
    );
}