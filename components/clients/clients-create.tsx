"use client";
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
import { createClients } from "@/services/clients";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const ClientsCreate = () => {
  const {user} = useSession();
  const router = useRouter();
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
      nombre: "",
      rtn: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const resultado = await createClients({ company_id: user.empresa.id, name: values.nombre, rtn: values.rtn });
    console.log('Resultado:', resultado);
    if(resultado.success){
      console.log('Cliente creado exitosamente');
      toast.success("Cliente creado exitosamente");
      router.push('/dashboard/clients');
      return;
    }

    toast.error("No se pudo crear el cliente");


  }
  return (
    <Card>
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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ClientsCreate;
