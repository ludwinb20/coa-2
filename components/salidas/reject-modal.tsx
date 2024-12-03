import { useState } from "react";
import { rejectCampo } from "@/services/salidas";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel } from "../ui/alert-dialog"; // Asegúrate de que la ruta sea correcta
import { toast } from "sonner";


export default function RejectCampo({ id }: { id: number }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [reason, setReason] = useState("");

    const handleReject = async () => {
        if (reason.trim() === "") {
            toast.error("Por favor, ingresa un motivo para el rechazo.");
            return;
        }

        try {
            const result = await rejectCampo(id, reason); // Asegúrate de que la función rejectCampo acepte un motivo
            if (result.success) {
                toast.success("Campo rechazado exitosamente.");
            } else {
                toast.error("Error al rechazar el campo. Intenta nuevamente.");
            }
            setIsDialogOpen(false); // Cierra el diálogo después de rechazar
            setReason(""); // Resetea el motivo
        } catch (error) {
            console.error("Error al rechazar el campo:", error);
            toast.error("Error al rechazar el campo. Intenta nuevamente.");
        }
    };

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button>Rechazar</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Motivo del Rechazo</AlertDialogTitle>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Escribe el motivo del rechazo..."
                        className="w-full h-24 p-2 border rounded"
                    />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancelar</AlertDialogCancel>
                    <Button onClick={handleReject}>Rechazar</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}