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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSession } from "@/app/session-provider";
import { createClients } from "@/services/clients";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Dropzone from "@/components/ui/dropzone";
import { useState } from "react";
import { ReloadIcon } from "@/icons/icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DateRangePicker } from "../ui/DateRangePicker";
import { DateRange } from "react-day-picker";
import { SideBarMenu } from "../layout/sidebar";
import { AbsenceCategory } from "@/types/models";

type Props = {
  categories: AbsenceCategory[];
}

const AbsencesCreate = ({categories} : Props) => {
  const { user } = useSession();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [datePicker, setDatePicker] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  console.log(categories);

  const formSchema = z.object({
    date: z.object({
      from: z.coerce.date().min(new Date()),
      to: z.coerce.date().min(new Date()),
    }),
    tipo: z.string({
      required_error: "El rol es requerido",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "",
      date: {
        from: undefined,
        to: undefined,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSaving(true);

    // const resultado = await createClients({
    //   file: selectedFile ?? undefined,
    // });

    setSaving(false);
    // if (resultado.success) {
    //   toast.success("Cliente creado exitosamente");
    //   router.push("/dashboard/clients");
    //   return;
    // }

    // toast.error("No se pudo crear el cliente");
  }

  return (
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Solicitar ausencia</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Fila 1 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)} // Vincular el valor seleccionado
                        value={field.value?.toString()} // Asegurar que el valor esté sincronizado
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="incapacidad">
                              Incapacidad
                            </SelectItem>
                            <SelectItem value="emergencia">
                              Emergencia
                            </SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Tipo de ausencia.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fechas</FormLabel>
                    <FormControl>
                      <DateRangePicker
                        text="Fechas"
                        datePicker={field.value}
                        setDatePicker={(range) => {
                          field.onChange(range);
                        }}
                      />
                    </FormControl>
                    <FormDescription>RTN de la empresa.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dropzone para el archivo */}
            <div className="grid grid-cols-1 gap-4 w-1/2">
                <FormLabel>Documentacion</FormLabel>
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
            <FormDescription>Opcional.</FormDescription>

            <Button type="submit">
              {saving ? <ReloadIcon className="animate-spin" /> : "Guardar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AbsencesCreate;
