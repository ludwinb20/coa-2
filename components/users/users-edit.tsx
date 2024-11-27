import { UserProfile, Role, Departamento } from "@/types/models";
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
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Dropzone from "../ui/dropzone";
import { deleteFile } from "@/utils/handle-files";
import { ReloadIcon } from "@radix-ui/react-icons";
import rolesPermissions from "@/utils/roles";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { updateUser } from "@/services/users";

const EditUsers = ({
  userProfile,
  roles,
  departments,
}: {
  userProfile: UserProfile;
  roles: Role[];
  departments: Departamento[];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(
    userProfile?.url ?? null
  );
  const [originalImageDeleted, setOriginalImageDeleted] =
    useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const { user } = useSession();
  const queryClient = useQueryClient();

  const deleteImg = async () => {
    setSelectedFile(null);
    if (userProfile.avatar_url && !originalImageDeleted) {
      const resultado = await deleteFile({
        bucket: "avatars",
        url: `users/${userProfile.avatar_url}`,
      });
      if (resultado.success) {
        setOriginalImageDeleted(true);
        setFileUrl(null);
      }
    }
  };

  const formSchema = z.object({
    email: z
      .string({
        required_error: "El email es requerido",
      })
      .email("El formato del email no es válido"),
    nombre: z
      .string({
        required_error: "El nombre es requerido",
        invalid_type_error: "El nombre debe ser un texto",
      })
      .refine((value) => /[a-zA-Z]/.test(value), {
        message:
          "El nombre no puede contener solo números, debe incluir al menos una letra",
      }),
    rol: z.string({
      required_error: "El rol es requerido",
    }),
    departamento: z.string({
      required_error: "El departamento es requerido",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userProfile.email ?? "",
      nombre: userProfile.full_name ?? "",
      rol: userProfile.rol_id?.toString() ?? "",
      departamento: userProfile.departamento_id?.toString() ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSaving(true);
    const resultado = await updateUser({
      id: userProfile.id,
      email: values.email,
      email_old: userProfile.email ?? "",
      full_name: values.nombre,
      rol_id: parseInt(values.rol, 10),
      departamento_id: parseInt(values.departamento, 10),
      file:
        selectedFile ?? (originalImageDeleted ? null : userProfile.avatar_url),
    });
    setSaving(false);

    if (resultado.success) {
      toast.success("Cliente actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["users", user?.id] });
      setOpen(false);
    } else {
      toast.error("No se pudo actualizar el cliente");
    }
  }

  if (user && !rolesPermissions.clients_edit.includes(user?.profile.rol_id)) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button
          variant="outline"
          className="border border-primary"
          onClick={() => setOpen(true)}
        >
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Fila 1 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. correo@devio.com" {...field} />
                    </FormControl>
                    <FormDescription>Email del usuario.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Pedro Martinez" {...field} />
                    </FormControl>
                    <FormDescription>Nombre de la usuario.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)} // Vincular el valor seleccionado
                        value={field.value?.toString()} // Asegurar que el valor esté sincronizado
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {roles.map((role) => (
                              <SelectItem
                                value={role.id.toString()} // Convertir el valor a string
                                key={role.id}
                              >
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Rol del usuario.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamentos</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)} // Vincular el valor seleccionado
                        value={field.value?.toString()} // Asegurar que el valor esté sincronizado
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {departments.map((departamento) => (
                              <SelectItem
                                value={departamento.id.toString()}
                                key={departamento.id}
                              >
                                {departamento.name + " - " + departamento.code}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Departamento del usuario.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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

export default EditUsers;
