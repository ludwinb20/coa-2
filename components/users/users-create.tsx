'use client';
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
import { createUsers } from "@/services/users";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Dropzone from "@/components/ui/dropzone";
import { useState } from "react";
import { ReloadIcon } from "@/icons/icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, Departamento } from "@/types/models";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface Props {
  roles: Role[];
  departments: Departamento[];
}

const UsersCreate = ({ roles, departments }: Props) => {
  const { user } = useSession();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const formSchema = z.object({
    email: z
      .string({
        required_error: "El email es requerido",
      })
      .email("El formato del email no es válido"),
    password: z
      .string({
        required_error: "La contraseña es requerida",
      })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(32, "La contraseña no puede tener más de 32 caracteres")
      .regex(/\d/, "La contraseña debe incluir al menos un número")
      .regex(
        /[@$!%*?&]/,
        "La contraseña debe incluir al menos un carácter especial (@$!%*?&)"
      ),
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
      email: "",
      password: "",
      nombre: "",
      rol: "",
      departamento: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSaving(true);
    // const formData = new FormData(); // Crear un objeto FormData para enviar datos y archivo
    // formData.append("company_id", user.empresa.id.toString());
    // formData.append("name", values.nombre);
    // formData.append("rtn", values.rtn);

    // if (selectedFile) {
    //   formData.append("file", selectedFile); // Adjuntar el archivo si existe
    // }

    // const resultado = await createClients(formData); // Enviar FormData en lugar de un objeto JSON

    const resultado = await createUsers({
      company_id: user ? user.empresa.id : 0,
      full_name: values.nombre,
      role_id: parseInt(values.rol, 10),
      department_id: parseInt(values.departamento, 10),
      file: selectedFile ?? undefined,
      email: values.email,
      password: values.password,
    });

    setSaving(false);
    if (resultado.success) {
      toast.success("Cliente creado exitosamente");
      router.push("/dashboard/users");
      return;
    }

    toast.error("No se pudo crear el cliente");
  }

  return (
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Crear Cliente</CardTitle>
      </CardHeader>
      <CardContent>
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
                name="password"
                render={({ field }) => {
                  const [showPassword, setShowPassword] = useState(false);

                  return (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="*************"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={
                              showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                          >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        La contraseña debe tener al menos 8 caracteres.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamentos</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(value)} // Vincular el valor seleccionado
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

            {/* Dropzone para el archivo */}
            <div className="grid grid-cols-2 gap-4"></div>

            <Button type="submit">
              {saving ? <ReloadIcon className="animate-spin" /> : "Guardar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UsersCreate;
