import { NextRequest, NextResponse } from "next/server";
import { makeScheduleCheck } from "@/utils/supabase/admin";
import fs from "fs";
import path from "path";

const secretKey = process.env.JWT_SECRET || "";

export const config = {
  api: {
    bodyParser: false, // Deshabilitar el bodyParser de Next.js
  },
};

export async function POST(req: NextRequest) {
  try {
    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader) {
      return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      console.log("Invalid authorization format");
      return NextResponse.json({ error: "Invalid authorization format" }, { status: 400 });
    }

    const token = authorizationHeader.split(" ")[1];
    if (token !== secretKey) {
      console.log("Hubo un error al procesar el token");
      return NextResponse.json(
        { error: "Hubo un error al procesar el token" },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const id = formData.get("id");
    const base64Photo = formData.get("photo");

    if (!id || !base64Photo) {
      console.log("Faltan datos requeridos");
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    if (typeof base64Photo !== "string") {
      console.log("El campo photo no es un base64 válido");
      return NextResponse.json({ error: "El campo photo no es un base64 válido" }, { status: 400 });
    }

    const buffer = Buffer.from(base64Photo, "base64");
    const file = new File([buffer], `${id}_photo.jpg`, { type: "image/jpeg" });
    const response = await makeScheduleCheck({ id: id as string, file: file });
    if (!response.success) {
      return NextResponse.json({ error: "Error procesando la solicitud" }, { status: 500 });
    }

    return NextResponse.json({ message: "Punch creado correctamente" }, { status: 200 });
  } catch (error: any) {
    console.error("Error en POST:", error.message);
    return NextResponse.json(
      { error: "Hubo un error interno en el servidor" },
      { status: 500 }
    );
  }
}
