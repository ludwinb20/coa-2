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

const ClientsCreate = () => {
  const { user } = useSession();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const formSchema = z.object({
    nombre: z
      .string({
        required_error: "El nombre es requerido",
        invalid_type_error: "El nombre debe ser un texto",
      })
      .refine((value) => /[a-zA-Z]/.test(value), {
        message:
          "El nombre no puede contener solo números, debe incluir al menos una letra",
      }),
    rtn: z
      .string({
        required_error: "El RTN es requerido",
      })
      .regex(/^\d+$/, {
        message: "El RTN solo puede contener números",
      })
      .refine((value) => value.length === 14, {
        message: "El RTN debe tener exactamente 14 dígitos",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      rtn: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSaving(true);
    // const formData = new FormData(); // Crear un objeto FormData para enviar datos y archivo
    // formData.append("company_id", user.empresa.id.toString());
    // formData.append("name", values.nombre);
    // formData.append("rtn", values.rtn);

    // if (selectedFile) {
    //   formData.append("file", selectedFile); // Adjuntar el archivo si existe
    // }

    // const resultado = await createClients(formData); // Enviar FormData en lugar de un objeto JSON
    
    const resultado = await createClients({
        company_id: user?.empresa.id ?? 0,
        name: values.nombre,
        rtn: values.rtn,
        file: selectedFile ?? undefined
      });

      setSaving(false);
    if (resultado.success) {
      toast.success("Cliente creado exitosamente");
      router.push("/dashboard/clients");
      return;
    }

    toast.error("No se pudo crear el cliente");
  }

  return (
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Crear Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Fila 1 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. AuthCode" {...field} />
                    </FormControl>
                    <FormDescription>Nombre de la empresa.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rtn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RTN</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. 5555555555555" {...field} />
                    </FormControl>
                    <FormDescription>RTN de la empresa.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dropzone para el archivo */}
            <div className="grid grid-cols-2 gap-4">
              <Dropzone
                onDrop={(files) => setSelectedFile(files[0])}
                onDelete={() => setSelectedFile(null)}
                className="bg-blue-100 border-2 border-dotted border-gray-300 rounded-lg py-4 px-6 text-center text-xs"
                text="Arrastre un archivo aquí o haga click para seleccionar un archivo"
              />
              {selectedFile && (
                <p className="text-sm text-gray-500">
                  Archivo seleccionado: {selectedFile.name}
                </p>
              )}
            </div>

            <Button type="submit">{saving ?  <ReloadIcon className="animate-spin" /> : "Guardar"}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ClientsCreate;
