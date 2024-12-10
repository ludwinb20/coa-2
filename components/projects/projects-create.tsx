"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/app/session-provider";
import { createCategory, createProject, getCategories } from "@/services/projects";
import { getClients } from "@/services/clients";
import { Client } from "@/types/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProjectCategory } from "@/types/models";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CategoryCreateDialog from "./category-create-dialog";


// Definir la interfaz para los valores del formulario
interface FormValues {
  nombre: string;
  cliente_id: string;  // Cambiado a string para el formulario
  categoria_id: string;  // Cambiado a string para el formulario
}

const ProjectCreate = () => {
  const router = useRouter();
  const { user } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.empresa.id) {
        const [fetchedClients, fetchedCategories] = await Promise.all([
          getClients({ empresa_id: user.empresa.id }),
          getCategories()
        ]);
        setClients(fetchedClients);
        setCategories(fetchedCategories);
      }
    };

    fetchData();
  }, [user]);

  const formSchema = z.object({
    nombre: z
      .string({
        required_error: "El nombre es requerido",
        invalid_type_error: "El nombre debe ser un texto",
      })
      .min(1, "El nombre no puede estar vacío"),
    cliente_id: z
      .string()
      .min(1, "Debe seleccionar un cliente"),
    categoria_id: z
      .string()
      .min(1, "Debe seleccionar una categoría"),
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      cliente_id: "",
      categoria_id: "",
    },
  });

  const categoryFormSchema = z.object({
    nombre: z
      .string({
        required_error: "El nombre es requerido",
      })
      .min(1, "El nombre no puede estar vacío"),
    descripcion: z
      .string()
      .optional(),
  });

  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const onCreateCategory = async (values: z.infer<typeof categoryFormSchema>) => {
    try {
      const result = await createCategory({
        nombre: values.nombre,
        descripcion: values.descripcion || "",
      });

      if (result.success && result.categoria) {
        toast.success("Categoría creada exitosamente");
        setCategories(prev => [...prev, result.categoria!]);
        setIsDialogOpen(false);
        categoryForm.reset();
        return false;
      } else {
        toast.error("No se pudo crear la categoría");
      }
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      toast.error("Error al crear la categoría");
    }
  };

  async function onSubmit(values: FormValues) {
    try {
      const { proyecto, success } = await createProject({
        nombre: values.nombre,
        cliente_id: parseInt(values.cliente_id),  // Convertir a número aquí
        categoria_id: parseInt(values.categoria_id),  // Convertir a número aquí
      });

      if (success) {
        toast.success("Proyecto creado exitosamente");
        router.push('/dashboard/projects');
      } else {
        toast.error("No se pudo crear el proyecto");
      }
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      toast.error("Error al crear el proyecto");
    }
  }

  return (
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Crear Proyecto</CardTitle>
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
                      <Input {...field} placeholder="Ej. Nombre del proyecto" />
                    </FormControl>
                    <FormDescription>Nombre del proyecto.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cliente_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Seleccione el cliente para el proyecto.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Categoría</FormLabel>
                      <CategoryCreateDialog
                        onCategoryCreated={(newCategory) => {
                          setCategories(prev => [...prev, newCategory]);
                        }}
                      />
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          category.id ? (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.nombre}
                            </SelectItem>
                          ) : null
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Seleccione la categoría del proyecto.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Crear Proyecto</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProjectCreate;
