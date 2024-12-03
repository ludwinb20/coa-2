import { rejectCampo } from "@/services/salidas";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function RejectCampo({ id }: { id: number }) {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");
    const handleReject = async () => {
        if (confirm("¿Estás seguro de que deseas rechazar este campo?")) {
            setLoading(true);
            try {
                await rejectCampo(id, reason);
                toast.success("Campo rechazado exitosamente.");
            } catch (error) {
                console.error("Error al rechazar el campo:", error);
                toast.error("Error al rechazar el campo. Intenta nuevamente.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Button onClick={handleReject} disabled={loading}>
            {loading ? "Rechazando..." : "Rechazar"}
        </Button>
    );
}