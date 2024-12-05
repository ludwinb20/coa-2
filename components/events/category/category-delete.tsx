import { Category, Events_category } from "@/types/models";

import { useSession } from "@/app/session-provider";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { deleteCategory } from "@/services/category";
import { Bin } from "@/icons/icons";
import rolesPermissions from "@/utils/roles";
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteCategoryEvents } from "@/services/events";



const DeleteCategorys = ({ category }: { category: Events_category }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useSession();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
        await deleteCategoryEvents(category.id);
        toast.success("Activo eliminado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["categories", user?.id] });
        setOpen(false);
    } catch (error) {
        toast.error("No se pudo eliminar el activo");
    }
  };

  if (user && !rolesPermissions.clients_delete.includes(user?.profile.rol_id)) {
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

export default DeleteCategorys;