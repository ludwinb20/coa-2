import { Client } from "@/types/models";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { EditIcon, MediaUploadIcon } from "@/icons/icons";
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
import { updateClient } from "@/services/clients";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Dropzone from "../ui/dropzone";
import { deleteFile } from "@/utils/handle-files";
import { ReloadIcon } from "@radix-ui/react-icons";
import rolesPermissions from "@/utils/roles";

const EditClient = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(client?.url ?? null);
  const [originalImageDeleted, setOriginalImageDeleted] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const { user } = useSession();
  const queryClient = useQueryClient();

  const deleteImg = async () => {
    setSelectedFile(null);
    if (client.file && !originalImageDeleted) {
      const resultado = await deleteFile({
        bucket: "avatars",
        url: `clients/${client.file}`,
      });
      if (resultado.success) {
        setOriginalImageDeleted(true);
        setFileUrl(null);
      }
    }
  };

  const formSchema = z.object({
    nombre: z
      .string()
      .min(1, "El nombre es requerido")
      .refine((value) => /[a-zA-Z]/.test(value), {
        message:
          "El nombre no puede contener solo números, debe incluir al menos una letra",
      }),
    rtn: z
      .string()
      .regex(/^\d+$/, { message: "El RTN solo puede contener números" })
      .length(14, "El RTN debe tener exactamente 14 dígitos"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: client.name,
      rtn: client.rtn,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSaving(true);
    const resultado = await updateClient({
      id: client.id,
      name: values.nombre,
      rtn: values.rtn,
      file: selectedFile ?? (originalImageDeleted ? null : client.file),
    });
    setSaving(false);

    if (resultado.success) {
      toast.success("Cliente actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes", user?.id] });
      setOpen(false);
    } else {
      toast.error("No se pudo actualizar el cliente");
    }
  }

  if(user && !rolesPermissions.clients_edit.includes(user?.profile.rol_id)){
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button variant="outline" className="border border-primary" onClick={() => setOpen(true)}>
          <EditIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl h-auto overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar cliente</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
            Actualize la informacion del cliente.
        </AlertDialogDescription>
            <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
            {/* Zona de archivos */}
            <div className="grid grid-cols-2 mt-8 gap-y-8">
              <Dropzone
                onDrop={(files) => {
                  setSelectedFile(files[0]);
                  setFileUrl(null);
                }}
                onDelete={deleteImg}
                url={fileUrl ?? ""}
                file={selectedFile}
                className="bg-blue-100 border-2 border-dotted border-gray-300 rounded-lg py-4 px-6 text-center text-xs hover:cursor-pointer"
                text="Arrastre un archivo aquí o haga click para seleccionar un archivo"
              />
              {selectedFile && (
                <p className="text-sm text-gray-500">
                  Archivo seleccionado: {selectedFile.name}
                </p>
              )}
            </div>

            <AlertDialogFooter className="mt-6">
              <Button type="submit">{saving ?  <ReloadIcon className="animate-spin" /> : "Guardar"}</Button>
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
