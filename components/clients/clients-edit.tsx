import { Client } from "@/types/clients";
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
import { useRouter } from "next/navigation";
import { useSession } from "@/app/session-provider";
import { updateClient } from "@/services/clients";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const EditClient = ({ client }: { client: Client }) => {
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
      nombre: client.name,
      rtn: client.rtn,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const resultado = await updateClient({
      id: client.id,
      name: values.nombre,
      rtn: values.rtn,
    });
    console.log("Resultado:", resultado);
    if (resultado.success) {
      console.log("Cliente creado exitosamente");
      toast.success("Cliente creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes", user.id] });
      setOpen(false);
      return;
    }

    toast.error("No se pudo crear el cliente");
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <EditIcon onClick={() => setOpen(true)} />
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl max-h-[40vh] h-auto overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar cliente</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Fila 1 */}
            <div className="grid grid-cols-2 gap-4 ">
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

export default EditClient;
