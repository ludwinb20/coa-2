import { Project, Client, ProjectCategory } from "@/types/models";
import { useEffect, useState } from "react";
import { getClients } from "@/services/clients";
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
import { getCategories, updateProject } from "@/services/projects";
import { useQueryClient } from "@tanstack/react-query";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProjectEdit = ({ project }: { project: Project }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const { user } = useSession();
  const queryClient = useQueryClient();

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
      .string()
      .min(1, "El nombre es requerido"),
    cliente_id: z
      .string()
      .min(1, "Debe seleccionar un cliente"),
    categoria_id: z
      .string()
      .min(1, "Debe seleccionar una categoría"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: project.nombre,
      cliente_id: project.cliente_id.toString(),
      categoria_id: project.categoria_id.toString(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSaving(true);
    const resultado = await updateProject({
      nombre: values.nombre,
      cliente_id: parseInt(values.cliente_id),
      categoria_id: parseInt(values.categoria_id),
    });
    setSaving(false);

    if (resultado.success) {
      toast.success("Proyecto actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      setOpen(false);
    } else {
      toast.error("No se pudo actualizar el proyecto");
    }
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
          <AlertDialogTitle>Editar proyecto</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Actualice la información del proyecto.
        </AlertDialogDescription>
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
                      <Input placeholder="Nombre del proyecto" {...field} />
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
                        {clients?.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Cliente del proyecto.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          category.id && (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.nombre}
                            </SelectItem>
                          )
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Categoría del proyecto.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AlertDialogFooter className="mt-6">
              <Button type="submit">
                {saving ? <ReloadIcon className="animate-spin" /> : "Guardar"}
              </Button>
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

export default ProjectEdit;