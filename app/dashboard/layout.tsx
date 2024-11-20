import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout ({children}: {children: ReactNode}) {
    const supabaseClient = createClient();
    const sesion = await supabaseClient.auth.getSession();
    console.log('sesion', sesion);

    if(!sesion.data.session){
        return redirect('/login');
    }
  return children;
}