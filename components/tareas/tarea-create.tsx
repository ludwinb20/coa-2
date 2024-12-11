"use client";

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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTarea } from "@/services/tareas";
import Dropzone from "@/components/ui/dropzone";
import { useState } from "react";
import { ReloadIcon } from "@/icons/icons";
import { Tarea } from "@/types/models";
import { useSession } from "@/app/session-provider";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/projects";
import { FileIcon } from "lucide-react";
import { getUsers } from "@/services/users";

const TareaCreate = () => {
  const { user } = useSession();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ empresa_id: user?.empresa.id ?? null }),
  });

  const formSchema = z.object({
    nombre: z
      .string({ 
        required_error: "El nombre es requerido",
        invalid_type_error: "El nombre debe ser un texto",
      })
      .min(1, "El nombre no puede estar vacío"),
    descripcion: z
      .string({
        required_error: "La descripción es requerida",
      })
      .min(1, "La descripción no puede estar vacía"),
    proyecto_id: z
      .number()
      .optional()
      .nullable()
      .default(null),
    encargado: z
      .string({
        required_error: "El encargado es requerido",
      }),
    prioridad: z.enum(["baja", "media", "alta"], {
      required_error: "La prioridad es requerida",
    }),
    estado: z.enum(["pendiente", "en_progreso", "completada"], {
      required_error: "El estado es requerido",
    }),
    fecha_inicio: z.date({
      required_error: "La fecha de inicio es requerida",
    }),
    fecha_final: z.date({
      required_error: "La fecha final es requerida",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      proyecto_id: null,
      encargado: "",
      prioridad: "media",
      estado: "pendiente",
      fecha_inicio: new Date(),
      fecha_final: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("Debe iniciar sesión para crear una tarea");
      return;
    }

    setSaving(true);
    try {
      const nuevaTarea = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        proyecto_id: values.proyecto_id ?? null,
        creador: user.id,
        encargado: values.encargado,
        prioridad: values.prioridad,
        estado: values.estado,
        fecha_inicio: values.fecha_inicio,
        fecha_final: values.fecha_final,
      };

      const files = selectedFile ? [selectedFile] : undefined;
      
      const tarea = await createTarea(nuevaTarea, files);

      toast.success("Tarea creada exitosamente");
      router.push('/dashboard/tareas');
    } catch (error) {
      toast.error("No se pudo crear la tarea");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-2">
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-800">
            Crear Nueva Tarea
          </h2>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Nombre de la Tarea</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej. Revisar documentación" 
                          {...field} 
                          className="focus:ring-2 focus:ring-blue-300"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Un nombre descriptivo y conciso para la tarea.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proyecto_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Proyecto</FormLabel>
                      <FormControl>
                        <select
                          className="w-full border rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => {
                            const value = e.target.value === '' ? null : parseInt(e.target.value);
                            field.onChange(value);
                          }}
                        >
                          <option value="" className="text-gray-500">Seleccionar proyecto</option>
                          {projects?.map((project) => (
                            <option key={project.id} value={project.id} className="text-gray-700">
                              {project.nombre}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Opcional: Asocia la tarea a un proyecto existente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">Descripción de la Tarea</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describa los detalles, objetivos y requisitos de la tarea" 
                        className="resize-none min-h-[120px] focus:ring-2 focus:ring-blue-300"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Proporcione una descripción detallada para mayor claridad.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="encargado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Encargado</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          <option value="" className="text-gray-500">Seleccionar encargado</option>
                          {users?.map((user) => (
                            <option key={user.id} value={user.id} className="text-gray-700">
                              {user.full_name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Persona responsable de completar la tarea.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fecha_inicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-gray-700">Fecha de Inicio</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            value={field.value.toISOString().split('T')[0]}
                            className="focus:ring-2 focus:ring-blue-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fecha_final"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-gray-700">Fecha Final</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            value={field.value.toISOString().split('T')[0]}
                            className="focus:ring-2 focus:ring-blue-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="prioridad"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-semibold text-gray-700">Prioridad</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value="baja" 
                              className="border-green-500 text-green-500 focus:ring-green-500"
                            />
                            <FormLabel className="text-green-700 font-medium">
                              Baja
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value="media" 
                              className="border-yellow-500 text-yellow-500 focus:ring-yellow-500"
                            />
                            <FormLabel className="text-yellow-700 font-medium">
                              Media
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value="alta" 
                              className="border-red-500 text-red-500 focus:ring-red-500"
                            />
                            <FormLabel className="text-red-700 font-medium">
                              Alta
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Determine la urgencia e importancia de la tarea.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Estado</FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="w-full border rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_progreso">En Progreso</option>
                          <option value="completada">Completada</option>
                        </select>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Indique el progreso actual de la tarea.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <Dropzone
                    onDrop={(files) => setSelectedFile(files[0])}
                    onDelete={() => setSelectedFile(null)}
                    className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg py-6 px-8 text-center hover:bg-blue-100 transition-colors"
                    text="Arrastre un archivo aquí o haga click para seleccionar"
                  />
                </div>
                {selectedFile && (
                  <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
                    <FileIcon className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={saving} 
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  {saving ? (
                    <>
                      <ReloadIcon className="animate-spin mr-2" /> 
                      Guardando...
                    </>
                  ) : (
                    "Crear Tarea"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default TareaCreate;