"use client";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectTrigger, SelectValue } from "../ui/select";
import { DateRangePicker } from "../ui/DateRangePicker";
import { options } from "./options-datepill";
import { useDatePills } from "@/hooks/date-pills";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePills } from "../ui/date-pills";
import { DataTableMarcajes } from "./table";
import { columnsMarcajes } from "./columns";
import { Departamento, Marcajes, Profile } from "@/types/models";

type Props = {
  marcajes: Marcajes[];
  departamentos: Departamento[];
  usuarios: Profile[];
};

export const ScheduleIndex = ({marcajes, departamentos, usuarios}: Props) => {
  const { selected, onChangeSelected, dates } = useDatePills({
    options,
    defaultSelected: "Últimos 30 días",
  });
  const [dateTimePicker, setDateTimePicker] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  return (
    <div>
      <Card className="rounded-md border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Control de horarios
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Card className="p-4 rounded-md shadow-inner">
            {/* Título de filtros */}
            <div className="flex justify-center items-center mb-6">
              <p className="text-lg font-bold">Marcajes de entrada y salida</p>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <SelectWithLabel placeholder="Seleccionar departamento" />
              <SelectWithLabel placeholder="Seleccionar horario" />
              <SelectWithLabel placeholder="Seleccionar empleado" />
            </div>

            {/* Rango de fechas y DatePills */}
            <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="col-span-1">
                    <DateRangePicker text="Fechas" />
                </div>
                <div className="col-span-2 flex justify-center items-center">
                    <DatePills selected={selected} onSelect={onChangeSelected} left={true} />
                </div>
            </div>
            <div>
            <DataTableMarcajes
                columns={columnsMarcajes}
                data={marcajes}
              />
            </div>

          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente Select reutilizable con etiqueta para accesibilidad
const SelectWithLabel = ({ placeholder }: { placeholder: string }) => (
  <div>
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
    </Select>
  </div>
);
