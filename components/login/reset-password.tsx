"use client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { resetPassowrd } from "@/services/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Definir el esquema de validación con Zod
const passwordSchema = z
  .string({
    required_error: "La contraseña es requerida",
  })
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(32, "La contraseña no puede tener más de 32 caracteres")
  .regex(/\d/, "La contraseña debe incluir al menos un número")
  .regex(
    /[@$!%*?&]/,
    "La contraseña debe incluir al menos un carácter especial (@$!%*?&)"
  );

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleClick = async () => {
    // Validar la contraseña con Zod
    const validationResult = passwordSchema.safeParse(password);

    if (!validationResult.success) {
      // Si la validación falla, mostrar el primer mensaje de error
      setError(validationResult.error.errors[0].message);
      return;
    }

    // Si la validación es exitosa, intentar restablecer la contraseña
    setError(""); // Limpiar el error
    const resultado = await resetPassowrd({ password });
    
    if (resultado) {
      toast.success("Contraseña actualizada exitosamente");
      router.push("/dashboard");
    } else {
      toast.error("Hubo un error al actualizar la contraseña");
    }
  };

  return (
    <Card className="w-full max-w-md bg-card rounded-md border">
      <CardHeader>
        <CardTitle>Reestablecer contraseña</CardTitle>
        <CardDescription>Ingrese su nueva contraseña.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="*************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {/* Mostrar el error si la validación falla */}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleClick}>Guardar</Button>
      </CardFooter>
    </Card>
  );
};
