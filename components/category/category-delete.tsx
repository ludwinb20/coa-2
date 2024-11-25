import { Category } from "@/types/category";
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
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { deleteCategory } from "@/services/category";
import { Bin } from "@/icons/icons";



const DeleteCategory = ({ category }: { category: Category }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useSession();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const resultado = await deleteCategory({
      id: category.id,
    });
    if (resultado.success) {
      toast.success("Activo eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["category", user.empresa.id] });
      setOpen(false);
      return;
    }

    toast.error("No se pudo eliminar el activo");
  };

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

export default DeleteCategory;