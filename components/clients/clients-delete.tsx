import { Client } from "@/types/clients";
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
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useSession } from "@/app/session-provider";
import { deleteCliente } from "@/services/clients";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bin } from "@/icons/icons";
import rolesPermissions from "@/utils/roles";

const DeleteClient = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useSession();
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    const resultado = await deleteCliente({
      id: client.id,
    });
    if (resultado.success) {
      toast.success("Cliente eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["clientes", user.id] });
      setOpen(false);
      return;
    }

    toast.error("No se pudo crear el cliente");
  };

  if(!rolesPermissions.clients_delete.includes(user.profile.rol_id)){
    return null;
  }
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger>
        <Button variant="outline" className="border border-destructive" onClick={() => setOpen(true)}>  
          <Bin color="red" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl max-h-[40vh] h-auto overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <Button variant={"destructive"} onClick={handleDelete}>
            Eliminar
          </Button>
          <AlertDialogCancel className="ml-2" onClick={() => setOpen(false)}>
            Cancelar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteClient;
