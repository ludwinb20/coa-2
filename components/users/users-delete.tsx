import { Client, UserProfile } from "@/types/models";
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
import { deleteUser } from "@/services/users";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bin } from "@/icons/icons";
import rolesPermissions from "@/utils/roles";

const DeleteUsers = ({ userProfile }: { userProfile: UserProfile }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useSession();
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    const resultado = await deleteUser({
      id: userProfile.id,
    });
    if (resultado.success) {
      toast.success("Uusario eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["users", user?.id] });
      setOpen(false);
      return;
    }

    toast.error("No se pudo eliminar el usuario");
  };

  if(user && !rolesPermissions.clients_delete.includes(user?.profile.rol_id)){
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
          <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
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

export default DeleteUsers;
