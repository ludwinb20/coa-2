import { Payroll, scheduleCheck } from '@/types/models';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from "uuid";
const admin = createServiceRoleClient();

function createServiceRoleClient(){
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
  }

export async function createUser({email, password}: {email: string, password: string}) {

    const { data, error } = await admin.auth.admin.createUser({ email, password });
    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
  
    return data;
}

export async function getUsers() {
    const { data, error } = await admin.auth.admin.listUsers();
    if (error) {
      console.error('Error listing users:', error);
      return null;
    }
  
    return data;
}

export async function updateUserEmail({email, id}: {email: string, id: string}) {
    const { data, error } = await admin.auth.admin.updateUserById( id, {
        email: email
    });
    console.log('User created:', data, 'Error:', error);
    if (error) {
      console.error('Error creating user:', error);
      return false;
    }
  
    return true;
}

export async function makeScheduleCheck({
  id,
  file,
}: {
  id: string;
  file: File;
}): Promise<{ success: boolean; data?: scheduleCheck }> {
  try {
    const result = await uploadFile({
      bucket: "punchs",
      file: file,
    });

    if (!result.success) return { success: false };
    let uploadedFile = result.data;
    const { data: payrollData, error: payrollError } = await admin
      .from("payroll")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (payrollError) {
      console.error("Error fetching payroll:", payrollError);
      return { success: false };
    }

    let payroll = payrollData?.[0];

    // Crear nómina si no existe ninguna
    if (!payroll) {
      const payrollResult = await createPayroll();
      if (!payrollResult.success || !payrollResult.data) {
        return { success: false };
      }
      payroll = payrollResult.data;
    }

    // Verificar si ya existe un registro de entrada sin salida
    const { data: currentPunch, error: currentPunchError } = await admin
      .from("schedule-checks")
      .select("*")
      .eq("payroll_id", payroll.id)
      .eq("user_id", id)
      .is("out", null)
      .limit(1);

    if (currentPunchError) {
      console.error("Error fetching current punch:", currentPunchError.message);
      return { success: false };
    }

    // Crear un nuevo registro si no existe entrada activa
    if (!currentPunch || currentPunch.length === 0) {
      const newPunch = await createNewPunch(payroll.id, id, uploadedFile ?? "");
      return newPunch;
    }

    const entrada = currentPunch[0].in;

    const fechaActual = new Date();
    if (!entrada) {
      console.error("El campo 'in' no está disponible o es nulo.");
      return { success: false };
    }
    
    const fechaEntrada = new Date(entrada); // Convertir a Date
    if (isNaN(fechaEntrada.getTime())) {
      console.error("El campo 'in' no es una fecha válida.");
      return { success: false };
    }
    
    const total = Math.floor((fechaActual.getTime() - fechaEntrada.getTime()) / 1000);

    // Actualizar el registro existente con la hora de salida
    const { data: updatedPunch, error: updateError } = await admin
      .from("schedule-checks")
      .update({
        out: fechaActual,
        total: total,
        out_photo: uploadedFile
      })
      .eq("id", currentPunch[0].id)
      .select("*");

    if (updateError) {
      console.error("Error updating punch:", updateError.message);
      return { success: false };
    }

    if (!updatedPunch || updatedPunch.length === 0) {
      console.error("No punch data returned after update.");
      return { success: false };
    }

    const { data: profiles, error: profileError } = await admin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .limit(1);
  
  if (profileError) {
    console.error("Error fetching profile:", profileError.message);
    return { success: false };
  }
  
  if (!profiles || profiles.length === 0) {
    console.error("No profile data returned after update.");
    return { success: false };
  }
  
  const profile = profiles[0];
  
  if (profile.avatar_url) {
    const { data: signedUrlData, error: signedUrlError } = await admin.storage
      .from("avatars")
      .createSignedUrl(`users/${profile.avatar_url}`, 3600);
  
    if (signedUrlError) {
      console.error("Error generating signed URL:", signedUrlError.message);
    }else{
      profile.url = signedUrlData.signedUrl;
    }
  }
  const opciones: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

   profile.hora = fechaActual.toLocaleTimeString("es-ES", opciones);
   console.log(profile);
    return { success: true, data: profile };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false };
  }
}

export async function createPayroll(): Promise<{
  success: boolean;
  data?: Payroll;
}> {
  try {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const start =
      currentDay >= 16
        ? new Date(currentYear, currentMonth, 16)
        : new Date(currentYear, currentMonth, 1);

    const end =
      currentDay <= 15
        ? new Date(currentYear, currentMonth, 15)
        : new Date(
            currentYear,
            currentMonth,
            new Date(currentYear, currentMonth + 1, 0).getDate()
          );

    const { data: payroll, error } = await admin
      .from("payroll")
      .insert([
        {
          start: start,
          end: end,
        },
      ])
      .select("*");

    if (error) {
      console.error("Error inserting payroll:", error.message);
      return { success: false };
    }

    if (!payroll || payroll.length === 0) {
      console.error("No payroll data returned after insert.");
      return { success: false };
    }

    console.log("Payroll created:", payroll[0]);
    return { success: true, data: payroll[0] };
  } catch (error) {
    console.error("Unexpected error creating payroll:", error);
    return { success: false };
  }
}

async function createNewPunch(
  payrollId: string,
  userId: string,
  file: string
): Promise<{ success: boolean; data?: scheduleCheck }> {
  try {
    const { data: punch, error: punchError } = await admin
      .from("schedule-checks")
      .insert([
        {
          payroll_id: payrollId,
          user_id: userId,
          in: new Date(),
          out: null,
          total: null,
          in_photo: file,
          out_photo: null,
        },
      ])
      .select("*");

    if (punchError) {
      console.error("Error inserting punch:", punchError.message);
      return { success: false };
    }

    if (!punch || punch.length === 0) {
      console.error("No punch data returned after insert.");
      return { success: false };
    }

    return { success: true, data: punch[0] };
  } catch (error) {
    console.error("Unexpected error creating punch:", error);
    return { success: false };
  }
}

const uploadFile = async ({bucket, file}:{bucket: string,  file: File}) => {
  try {
    const fileExtension = getFileExtension(file.name);
    const name = `${uuidv4()}.${fileExtension}`;

    const { data, error } = await admin.storage
      .from(bucket)
      .upload(name, file, {
        upsert: true,
      });
    if (error) {
      console.log('Error uploading file: ', error);
      return {data: null, success: false};
    }

    return {data: name, success: true};
    } catch (error) {
      console.log('Error uploading file: ', error);
      return {data: null, success: false};
    }
}

const getFileExtension = (fileName: string) => {
  const fileNameSplit = fileName.split('.')
  return fileNameSplit[fileNameSplit.length - 1]
}