import jwt from 'jsonwebtoken';
import { makeScheduleCheck } from '@/utils/supabase/admin';
const secretKey = process.env.JWT_SECRET || '';
import { login } from "@/services/user";

export async function POST(request: Request) {
  try {
    const authorizationHeader = request.headers.get("Authorization");
    const body = await request.json();
    if (!authorizationHeader) {
      return new Response("Authorization header missing", { status: 401 });
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      return new Response("Invalid authorization format", { status: 400 });
    }

    const token = authorizationHeader.split(" ")[1];

    if(token != secretKey){
      return new Response(
        JSON.stringify({ error: "Hubo un error al procesar el token" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
      const response = await makeScheduleCheck({id: body.id});
      if (!response.success) {
        return new Response("Error procesando la solicitud", { status: 500 });
      }
      return new Response(
        JSON.stringify({ message: `Punch creado correctamente` }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
  } catch (error) {
    console.error("Error en POST:", error);
    return new Response(
      JSON.stringify({ error: "Hubo un error al procesar el token" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

