import { Asset } from "@/types/asset";
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
import { deleteAsset } from "@/services/asset"; // Asegúrate de que esta función esté definida
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { Bin } from "@/icons/icons";
import rolesPermissions from "@/utils/roles";


const DeleteAsset = ({ asset }: { asset: Asset }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useSession();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const resultado = await deleteAsset({
      id: asset.id,
    });
    if (resultado.success) {
      toast.success("Activo eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["assets", user.empresa.id] });
      setOpen(false);
      return;
    }

    toast.error("No se pudo eliminar el activo");
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
          <AlertDialogTitle>¿Eliminar activo?</AlertDialogTitle>
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

export default DeleteAsset;