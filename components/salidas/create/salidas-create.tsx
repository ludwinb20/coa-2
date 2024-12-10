"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/app/session-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCampo } from '@/services/salidas';
import { toast } from "sonner";
import { ReloadIcon } from "@/icons/icons";
import { useState, useEffect } from "react";
import { getClients } from '@/services/clients';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "@/types/models";
import { getUsers } from '@/services/users';
import { UserProfile } from "@/types/models";
import MultiSelectUsuarios from './multi-select';
import { Asset } from "@/types/asset";
import { getAsset } from "@/services/asset";
import { ScrollArea } from '@radix-ui/react-scroll-area';
import ScrollAssets from './scroll-assets';
import SelectEvents from "./select-events";


interface AssetAssignment {
  asset_id: string;
  usuario_id: string;
}

const SalidasCreate = () => {
  const [saving, setSaving] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const { user } = useSession();
  const [assetAssignments, setAssetAssignments] = useState<AssetAssignment[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, usersData, assetsData] = await Promise.all([
          getClients({ empresa_id: user?.empresa.id ?? null }),
          getUsers({ empresa_id: user?.empresa.id ?? null }),
          getAsset({ empresa_id: user?.empresa.id ?? null }),
        ]);
        setClients(clientsData);
        setUsers(usersData);
        setAssets(assetsData);
      } catch (error) {
        toast.error("Error al cargar los datos");
      }
    };
    loadData();
  }, [user?.empresa.id]);

  const formSchema = z.object({
    proyecto_id: z.number({
      required_error: "El ID del proyecto es requerido",
    }).min(1, "El ID del proyecto debe ser mayor a 0"),
    cliente_id: z.number({
      required_error: "El ID del cliente es requerido",
    }).min(1, "El ID del cliente debe ser mayor a 0"),
    usuarios_ids: z.array(z.string(), {
      required_error: "Al menos un usuario es requerido",
    }).min(1, "Seleccione al menos un usuario"),
    fecha_inicio: z.date({
      required_error: "La fecha de inicio es necesaria ",
    }),
    fecha_final: z.date({
      required_error: "La fecha final es necesaria",
    }),
    assets_ids: z.array(z.string(), {
      required_error: "Al menos un asset es requerido",
    }).min(1, "Seleccione al menos un asset"),
    evento_id: z.number().optional(),
  }).refine((data) => data.fecha_inicio < data.fecha_final, {
    message: "La fecha final debe ser posterior a la fecha de inicio",
    path: ["fecha_final"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proyecto_id: undefined,
      cliente_id: 0,
      usuarios_ids: [],
      fecha_inicio: new Date(),
      fecha_final: new Date(),
      assets_ids: [],
    },
  });

  const handleAssetAssignment = (assignments: AssetAssignment[]) => {
    setAssetAssignments(assignments);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSaving(true);
    try {
      if (!user?.id) {
        throw new Error("Usuario no autenticado");
      }
      
      const { evento_id, ...restValues } = values;
      const payload = {
        ...restValues,
        usuario_ids: values.usuarios_ids.map(String),
        asset_assignments: assetAssignments,
        evento_id: evento_id ?? null
      };

      await createCampo(payload);
      toast.success("Salida a campo creada exitosamente");
    } catch (error) {
      toast.error("Error al crear la salida a campo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Crear Nuevo Campo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="proyecto_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proyecto ID</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        value={field.value ?? ''}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>ID del proyecto asociado.</FormDescription>
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
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value.toString()}
                    >
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
                    <FormDescription>Seleccione el cliente asociado.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usuarios_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuarios Responsables</FormLabel>
                    <MultiSelectUsuarios 
                      selectedUsers={field.value.map(id => id.toString())}
                      onChange={field.onChange}
                    />
                    <FormDescription>Seleccione los usuarios responsables.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evento_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evento</FormLabel>
                    <SelectEvents
                      onChange={(value) => field.onChange(value)}
                    />
                    <FormDescription>Seleccione el evento asociado (opcional).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Inicio</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        value={field.value.toISOString().split('T')[0]}
                        onChange={e => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Fecha de inicio de la salida a campo.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fecha_final"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Final</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        value={field.value.toISOString().split('T')[0]}
                        onChange={e => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Fecha final de la salida a campo.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assets_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activos</FormLabel>
                  <ScrollAssets 
                    empresa_id={user?.empresa.id ?? null}
                    onChange={field.onChange}
                    value={field.value}
                    selectedUsers={users.filter(user => 
                      form.getValues().usuarios_ids.includes(user.id.toString())
                    )}
                    onAssignmentChange={handleAssetAssignment}
                  />
                  <FormDescription>Seleccione los activos para la salida a campo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={saving}>
              {saving ? <ReloadIcon className="animate-spin" /> : "Crear"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SalidasCreate;


