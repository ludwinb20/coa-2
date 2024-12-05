"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/app/session-provider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategoryEvents } from "@/services/events";

const CategorysCreate = () => {
  const router = useRouter();
  const { user } = useSession();
  
  const formSchema = z.object({
    nombre: z
      .string({
        required_error: "El nombre es requerido",
        invalid_type_error: "El nombre debe ser un texto",
      })
      .min(1, "El nombre no puede estar vacío"),
    descripcion: z
      .string()
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const resultado = await createCategoryEvents({
        nombre: values.nombre,
        descripcion: values.descripcion || '',
        id: 0,
        created_at: new Date()
      });

      if (resultado.success) {
        toast.success("Categoría creada exitosamente");
        router.push('/dashboard/events/category');
        return;
      }

      toast.error("No se pudo crear la categoría");
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      toast.error("Error al crear la categoría");
    }
  }

  return (
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Crear Categoría</CardTitle>
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
                      <Input {...field} placeholder="Ej. Nombre de la categoría" />
                    </FormControl>
                    <FormDescription>Nombre de la categoría.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Descripción de la categoría" />
                    </FormControl>
                    <FormDescription>Descripción opcional de la categoría.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Crear Categoría</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CategorysCreate;