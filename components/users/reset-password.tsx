import { ReloadIcon, SettingsIcon } from "@/icons/icons";
import { Button } from "../ui/button";
import { sendResetPassowrd } from "@/services/users";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useState } from "react";
import { toast } from "sonner";

const ResetPassowrd = ({ email }: { email: string }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    const result = await sendResetPassowrd({ email: email });
    console.log(result);
    setLoading(false);

    if (result) {
      toast.success("Se ha enviado el correo de recuperación de contraseña");
      return;
    }

    toast.error("Error enviando el correo de recuperación de contraseña");
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border border-teal-600 px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent hover:text-white transition-all"
            onClick={handleClick}
          >
            {loading ? (
              <ReloadIcon className="animate-spin text-teal-600" />
            ) : (
              <SettingsIcon
                className="w-4 h-4 text-teal-600"
                aria-hidden="true"
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reestablecer contraseña</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ResetPassowrd;
