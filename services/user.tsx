import { createClient } from "@/utils/supabase/client";

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const supabase = createClient();
    const { email, password } = credentials;
    const { error, data: authData } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error("Error al iniciar sesión: " + error.message);
    }

    if (authData?.user) {
      window.location.reload();
    }
  } catch (err) {
    console.error("Error inesperado al iniciar sesión", err);
    throw new Error("Error inesperado al iniciar sesión");
  }
};
