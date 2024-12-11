"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { useSession } from "@/app/session-provider";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/ui/dropzone";
import { useState } from "react";
import { CalendarIcon, ReloadIcon } from "@/icons/icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DateRange } from "react-day-picker";
import { AbsenceCategory } from "@/types/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

type Props = {
  categories: AbsenceCategory[];
};

type Time = {
  hours: number;
  minutes: number;
};

const AbsencesCreate = ({ categories }: Props) => {
  const { user } = useSession();
  const router = useRouter();
  const [type, setType] = useState<AbsenceCategory | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [datePicker, setDatePicker] = useState<DateRange | undefined>();
  const [hours, setHours] = useState<boolean>(false);
  const [horaI, setHoraI] = useState<string | undefined>();
  const [horaF, setHoraF] = useState<string | undefined>();

  const formSchema = z.object({
    tipo: z.string().nonempty("El tipo es requerido"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, datePicker, hours, horaI, horaF);
    setSaving(true);
    if (hours == true) {
      if (!horaI || !horaF) {
        toast.error("Debe seleccionar hora de inicio y final");
        return;
      }

      if (datePicker?.from && datePicker?.to) {
        const updatedFrom = new Date(datePicker.from);
        const updatedTo = new Date(datePicker.to);

        const [horaIHours, horaIMinutes] = horaI.split(":").map(Number);
        const [horaFHours, horaFMinutes] = horaF.split(":").map(Number);

        updatedFrom.setHours(horaIHours, horaIMinutes, 0, 0);
        updatedTo.setHours(horaFHours, horaFMinutes, 0, 0);

        setDatePicker({ from: updatedFrom, to: updatedTo });

        console.log(datePicker);
      }
    }
    setSaving(false);
    // toast.success("Ausencia creada exitosamente");
    // router.push("/dashboard/absences");
  }

  return (
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Solicitar ausencia</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setType(
                            categories.find((c) => c.id.toString() === value)
                          );
                          setDatePicker(undefined);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.nombre}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Selecciona el tipo de ausencia.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 w-full">
                <FormLabel>Documentación</FormLabel>
                <Dropzone
                  onDrop={(files) => setSelectedFile(files[0])}
                  onDelete={() => setSelectedFile(null)}
                  className="bg-blue-100 border-2 border-dotted border-gray-300 rounded-lg py-4 px-6 text-center text-xs"
                  text="Arrastre un archivo aquí. (Una carpeta comprimida en caso de que sean varios archivos)"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-500">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 w-1/2">
              {" "}
              <div>
                <FormLabel>Fecha</FormLabel>
                <Card className="p-4 mt-3">
                  <Tabs defaultValue="menos">
                    <TabsList className="flex justify-around border-b">
                      <TabsTrigger value="menos">Menos de un día</TabsTrigger>
                      <TabsTrigger value="igual">Un día</TabsTrigger>
                      <TabsTrigger value="mas">Más de un día</TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="menos"
                      className="flex justify-center items-center"
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !datePicker?.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {datePicker?.from ? (
                              format(datePicker?.from, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={datePicker?.from ?? undefined}
                            onSelect={(d) => {
                                setDatePicker({ from: d, to: d });
                                setHours(true);
                            }}
                            className="rounded-md border"
                            disabled={(date) => {
                                const anticipacionDias = type?.anticipacion ?? 0;
                                const fechaMinima = new Date();
                                fechaMinima.setDate(fechaMinima.getDate() + anticipacionDias);
                                return date < fechaMinima;
                              }}
                          />
                        </PopoverContent>
                      </Popover>
                      <input
                        placeholder="00:00"
                        className="w-24 ml-2"
                        type="time"
                        onChange={(e) => setHoraI(e.target.value)}
                      />
                      -
                      <input
                        placeholder="00:00"
                        className="w-24 ml-2"
                        type="time"
                        onChange={(e) => setHoraF(e.target.value)}
                      />
                    </TabsContent>
                    <TabsContent
                      value="igual"
                      className="flex justify-center items-center"
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !datePicker?.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {datePicker?.from ? (
                              format(datePicker?.from, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={datePicker?.from ?? undefined}
                            onSelect={(d) => {
                              setDatePicker({ from: d, to: d });
                              setHours(false);
                            }}
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                    </TabsContent>
                    <TabsContent
                      value="mas"
                      className="flex justify-center items-center"
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !datePicker?.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {datePicker?.from ? (
                              format(datePicker?.from, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="range"
                            selected={datePicker}
                            onSelect={(d) => {
                              if (d?.from && type && type.rango !== null) {
                                const fromDate = new Date(d.from);
                                const toDate = new Date(
                                  fromDate.getTime() +
                                    (type.rango - 1) * 24 * 60 * 60 * 1000
                                ); 
                                setDatePicker({ from: fromDate, to: toDate });
                              } else if (d) {
                                setDatePicker(d);
                              }
                              setHours(false);
                            }}
                            className="rounded-md border"
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </TabsContent>
                  </Tabs>
                </Card>
                <FormDescription>
                  Selecciona la fecha de la ausencia.
                </FormDescription>
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <ReloadIcon className="animate-spin" /> : "Guardar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AbsencesCreate;
