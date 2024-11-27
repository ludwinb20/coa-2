import { Asset } from "@/types/asset";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ObserveIcon } from "@/icons/icons";
import { Button } from "../ui/button";
import { useState } from "react";
import { Card } from "../ui/card";
import { X } from "lucide-react";

const ViewAsset = ({ asset }: { asset: Asset }) => {
  const [open, setOpen] = useState<boolean>(false);

  // Función para formatear el precio sin punto
  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).replace(/\./g, '');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" className="border-primary hover:bg-primary/10">
          <ObserveIcon color="green" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] w-full overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-primary">
            Detalles del Activo
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-0 right-0"
            onClick={() => setOpen(false)}
          >
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </Button>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Imagen */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            {asset.url ? (
              <img 
                src={asset.url} 
                alt={asset.nombre} 
                className="max-w-full max-h-[400px] object-contain rounded-lg shadow-md" 
              />
            ) : (
              <p className="text-gray-500 italic">No hay imagen disponible</p>
            )}
          </div>

          {/* Detalles */}
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Nombre" value={asset.nombre} />
              <DetailRow label="Precio" value={`L. ${formatPrice(asset.precio)}`} />
              <DetailRow label="Estado" value={asset.estado} />
              <DetailRow 
                label="Disponibilidad" 
                value={asset.disponibilidad ? "Disponible" : "Ocupado"}
                valueClassName={asset.disponibilidad ? "text-green-600" : "text-red-600"}
              />
              <DetailRow label="Categoría" value={asset.categoria_id} />
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DetailRow = ({ 
  label, 
  value, 
  valueClassName = "" 
}: { 
  label: string, 
  value: string | number, 
  valueClassName?: string 
}) => (
  <>
    <div className="text-gray-600 font-medium">{label}:</div>
    <div className={`font-semibold ${valueClassName}`}>{value}</div>
  </>
);

export default ViewAsset;