import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { ProjectCategory } from "@/types/models";
import { createCategory } from "@/services/projects";

interface CategoryCreateDialogProps {
  onCategoryCreated: (category: ProjectCategory) => void;
}

const CategoryCreateDialog = ({ onCategoryCreated }: CategoryCreateDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formSchema = z.object({
    nombre: z
      .string({
        required_error: "El nombre es requerido",
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await createCategory({
        nombre: values.nombre,
        descripcion: values.descripcion || "",
      });

      if (result.success && result.categoria) {
        toast.success("Categoría creada exitosamente");
        onCategoryCreated(result.categoria);
        setIsOpen(false);
        form.reset();
      } else {
        toast.error("No se pudo crear la categoría");
      }
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      toast.error("Error al crear la categoría");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
          <Settings className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Crear Nueva Categoría</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form 
            onSubmit={(e) => {
              e.stopPropagation();  // Detener la propagación del evento
              e.preventDefault();    // Prevenir el comportamiento por defecto
              form.handleSubmit(onSubmit)(e);
            }} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre de la categoría" />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Crear Categoría
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryCreateDialog; 