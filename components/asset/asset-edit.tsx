import { Asset } from "@/types/models";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { EditIcon } from "@/icons/icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useSession } from "@/app/session-provider";
import { updateAsset } from "@/services/asset";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import rolesPermissions from "@/utils/roles";

const EditAsset = ({ asset }: { asset: Asset }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useSession();
  const queryClient = useQueryClient();
  
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
      nombre: asset.nombre,
      precio: asset.precio,
      estado: asset.estado,
      disponibilidad: asset.disponibilidad ? "disponible" : "ocupado",
      categoria: asset.categoria_id,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const resultado = await updateAsset({
      id: asset.id,
      company_id: user?.empresa.id ?? 0,
      name: values.nombre,
      precio: values.precio,
      estado: values.estado,
      disponibilidad: values.disponibilidad === "disponible",
      categoria: values.categoria,
    });

    if (resultado.success) {
      toast.success("Activo actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["assets", user?.id] });
      setOpen(false);
      return;
    }

    toast.error("No se pudo actualizar el activo");
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
          <AlertDialogTitle>Editar Activo</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 ">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Nombre del activo" {...field} />
                    </FormControl>
                    <FormDescription>Nombre del activo.</FormDescription>
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
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </FormControl>
                    <FormDescription>Precio del activo.</FormDescription>
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
                    <FormDescription>Estado del activo.</FormDescription>
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
                    <FormDescription>¿Está disponible el activo?</FormDescription>
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
                      <Input
                        type="number"
                        placeholder="Ej. 1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Categoría del activo (número).</FormDescription>
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

export default EditAsset;