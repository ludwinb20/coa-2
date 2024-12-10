import React, { useEffect, useState } from 'react';
import { getEvents } from '@/services/events';
import { Event } from '@/types/models';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SelectEventsProps {
  onChange: (value: number) => void;
}

const SelectEvents: React.FC<SelectEventsProps> = ({ onChange }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const eventsData = await getEvents();
      setEvents(eventsData);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Select onValueChange={(value) => onChange(Number(value))}>
      <SelectTrigger>
        <SelectValue placeholder="Seleccione un evento" />
      </SelectTrigger>
      <SelectContent>
        {events.map(event => (
          <SelectItem key={event.id || ''} value={event.id?.toString() || ''}>
            {event.nombre} - {event.clients?.name || 'No Client'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectEvents;
