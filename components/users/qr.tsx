import { useState, useRef } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { Bin, QrCodeIcon } from "@/icons/icons";
import rolesPermissions from "@/utils/roles";
import { Card, CardContent } from "../ui/card";
import QRCode from "react-qr-code";
import { DownloadIcon } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const QRUser = ({ userProfile }: { userProfile: UserProfile }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useSession();
  const ref = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    console.log("hola", ref);
    if (ref.current) {
      htmlToImage
        .toPng(ref.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${userProfile.id}-image.png`;
          link.click();
        })
        .catch((error) => {
          console.error("Error al convertir HTML a imagen:", error);
        });
    }
  };

  if (user && !rolesPermissions.clients_delete.includes(user?.profile.rol_id)) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border border-blue-400"
          onClick={() => setOpen(true)}
        >
          <QrCodeIcon color="#36739c" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Código de empleado</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex justify-end items-center space-x-2">
          <Avatar>
            <AvatarImage
              src={userProfile?.avatar_url ?? undefined}
              alt={userProfile?.full_name ?? "avatar"}
            />
            <AvatarFallback>
              {userProfile?.full_name?.slice(0, 2).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <p>{userProfile?.full_name}</p>
        </div>

        <Card className="relative inline-block p-6">
          {/* Botón en la esquina superior derecha */}
          <Button
            variant="outline"
            className="absolute top-2 right-2"
            onClick={handleDownload}
          >
            <DownloadIcon />
          </Button>

          <CardContent className="flex justify-center items-center">
            {userProfile?.id ? (
              <div ref={ref}>
                <QRCode value={userProfile.id} />
              </div>
            ) : (
              <p className="text-muted-foreground">No hay código disponible</p>
            )}
          </CardContent>
        </Card>

        <AlertDialogFooter className="mt-6">
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QRUser;
