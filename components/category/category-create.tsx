"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CategoryCreate = () => {
  
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

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <input type="text" {...field} placeholder="Ej. Nombre de la categoría" />
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
                <textarea {...field} placeholder="Descripción de la categoría" />
              </FormControl>
              <FormDescription>Descripción opcional de la categoría.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <button type="submit">Crear Categoría</button>
      </form>
    </Form>
  );
};

export default CategoryCreate;