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
import { createAsset } from "@/services/asset";
import { Select } from "../ui/select";
import Dropzone from "@/components/ui/dropzone";
import { useState, useEffect } from "react";
import { ReloadIcon } from "@/icons/icons";
import { getCategories } from "@/services/category";

const AssetCreate = () => {
  const { user } = useSession();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [categories, setCategories] = useState<{ id: number, nombre: string }[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const response = await getCategories({ empresa_id: user?.empresa.id ?? null });
      if (response.length > 0) {
        setCategories(response);
      } else {
        toast.error("No se pudieron cargar las categorías");
      }
    }
    fetchCategories();
  }, []);

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
    precio: z
      .number({
        required_error: "El precio es requerido",
        invalid_type_error: "El precio debe ser un número",
      })
      .positive("El precio debe ser un número positivo"),
    estado: z
      .string({
        required_error: "El estado es requerido",
      })
      .min(1, "El estado no puede estar vacío"),
    disponibilidad: z.enum(["disponible", "ocupado"], {
      required_error: "La disponibilidad es requerida",
    }),
    categoria: z
      .number({
        required_error: "La categoría es requerida",
        invalid_type_error: "La categoría debe ser un número",
      })
      .min(1, "La categoría debe ser un número positivo"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      precio: 0,
      estado: "",
      disponibilidad: "disponible",
      categoria: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSaving(true);
    const resultado = await createAsset({
      company_id: user?.empresa.id ?? 0,
      name: values.nombre,
      precio: values.precio,
      estado: values.estado,
      disponibilidad: values.disponibilidad === "disponible",
      categoria: values.categoria,
      file: selectedFile ?? undefined
    });

    setSaving(false);
    if (resultado.success) {
      toast.success("Cliente creado exitosamente");
      router.push('/dashboard/asset_Management');
      return;
    }

    toast.error("No se pudo crear el cliente");
  }

  return (
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Crear Activo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Nombre del producto" {...field} />
                    </FormControl>
                    <FormDescription>Nombre del producto.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ej. 100" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) )}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </FormControl>
                    <FormDescription>Precio del producto.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Golpeado" {...field} />
                    </FormControl>
                    <FormDescription>Estado del producto.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="disponibilidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disponibilidad</FormLabel>
                    <FormControl>
                      <select {...field} className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full">
                        <option value="disponible">Disponible</option>
                        <option value="ocupado">Ocupado</option>
                      </select>
                    </FormControl>
                    <FormDescription>¿Está disponible el producto?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full"
                      >
                        <option value="">Seleccione una categoría</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.nombre}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>Seleccione la categoría del producto.</FormDescription>
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

            <Button type="submit" disabled={saving}>
              {saving ? <ReloadIcon className="animate-spin" /> : "Crear"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AssetCreate;