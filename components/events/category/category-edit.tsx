import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useSession } from "@/app/session-provider";
import { updateCategory } from "@/services/category";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Category, Events_category } from "@/types/models";
import rolesPermissions from "@/utils/roles";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { EditIcon } from "@/icons/icons";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateCategoryEvents } from "@/services/events";

const EditCategorys = ({ category }: { category: Events_category }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useSession();
  const queryClient = useQueryClient();
  
  const formSchema = z.object({
    nombre: z
      .string({
        required_error: "El nombre es requerido",
        invalid_type_error: "El nombre debe ser un texto",
      })
      .min(1, "El nombre no puede estar vacío"),
    company_id: z
      .number({
        required_error: "El ID de la compañía es requerido",
        invalid_type_error: "El ID de la compañía debe ser un número",
      })
      .min(1, "El ID de la compañía debe ser un número positivo"),
    descripcion: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: category.nombre,
      company_id: user?.empresa.id,
      descripcion: category.descripcion,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const resultado = await updateCategoryEvents({
      id: category.id,
      nombre: values.nombre,
      descripcion: values.descripcion || "",
      created_at: category.created_at,
    });

    if (resultado.success) {
      toast.success("Categoría actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["categories", user?.id] });
      setOpen(false);
      return;
    }

    toast.error("No se pudo actualizar la categoría");
  }
  
  if(user && !rolesPermissions.clients_delete.includes(user?.profile.rol_id)){
    return null;
  }


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
      <Button variant="outline" className="border border-primary" onClick={() => setOpen(true)}>
          <EditIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl max-h-[40vh] h-auto overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Categoría</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Nombre de la categoría" {...field} />
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
                      <Input
                        type="text"
                        placeholder="Descripción de la categoría"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Descripción opcional de la categoría.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AlertDialogFooter className="mt-6">
              <Button type="submit">Guardar</Button>
              <AlertDialogCancel
                className="ml-2"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditCategorys;