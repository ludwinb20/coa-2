import { Project } from "@/types/models";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/app/session-provider";
import { ReloadIcon } from "@radix-ui/react-icons";
import { deleteProject } from "@/services/projects";

const ProjectDelete = ({ project }: { project: Project }) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useSession();

  const handleDelete = async () => {
    if (!project.id) {
      toast.error("ID de proyecto no válido");
      return;
    }

    try {
      setDeleting(true);
      const result = await deleteProject(project.id);

      if (result.success) {
        toast.success("Proyecto eliminado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["proyectos", user?.id] });
        setOpen(false);
        return;
      }

      toast.error("No se pudo eliminar el proyecto");
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
      toast.error("Error al eliminar el proyecto");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="border-destructive">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            proyecto <span className="font-bold">{project.nombre}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleting ? (
              <ReloadIcon className="animate-spin" />
            ) : (
              "Eliminar Proyecto"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProjectDelete;
