import { Payroll, Profile, scheduleCheck, UserProfile } from '@/types/models';
import { createClient } from '@supabase/supabase-js';
import { isAfter } from 'date-fns';
import { get } from 'http';
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
  type
}: {
  id: string;
  file: File;
  type: string;
}): Promise<{ success: boolean; data?: UserProfile; code?: number }> {
  // const errorsCode = {
  //   101: "Usted ya marco su entrada hoy",
  //   106: "Usted ya marco su salida del almuerzo hoy",
  //   102: "Usted no ha marcado entrada el dia de hoy",
  //   103: "Usted no ha marcado salida a almuerzo hoy",
  //   104: "Usted ya marco su entrada del almuerzo hoy",
  //   105: "Usted no ha marcado entrada del almuerzo hoy",
  //   107: "Usted ya marco su salida hoy",
  // }
  try {
    const result = await uploadFile({
      bucket: "punchs",
      file: file,
    });

    
    if (!result.success) return { success: false };
    let uploadedFile = result.data;
    
    const payroll = await getPayroll();
    if(payroll === null) return { success: false };

    const fechaActual = new Date();

    const opciones: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Tegucigalpa"
    };
        
    const dateFormatted = fechaActual.toLocaleTimeString("es-ES", opciones);


    if(type === "entrada"){
      const { data: currentPunch, error: currentPunchError } = await admin
      .from("schedule-checks")
      .select("*")
      .eq("payroll_id", payroll.id)
      .eq("user_id", id)
      .gte("created_at", new Date().toISOString().split("T")[0]) // Fecha de inicio del día actual
      .lt("created_at", new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]) // Inicio del siguiente día
      .limit(1);

      if (currentPunchError) {
        console.error("Error fetching current punch:", currentPunchError.message);
        return { success: false };
      }
  
      if (!currentPunch || currentPunch.length === 0) {
  
        const newPunch = await createNewPunch(payroll.id, id, uploadedFile ?? "");

        if(newPunch.success === false) return { success: false };
      
        const profile = await getProfile(id);
        if(profile === null) return { success: false };

       profile.hora = dateFormatted;
       console.log(profile);
        return { success: true, data: profile };
      }

      return { success: false, code: 101 };
    }

    if(type === "salida_almuerzo"){
      const { data: currentPunch, error: currentPunchError } = await admin
      .from("schedule-checks")
      .select("*")
      .eq("payroll_id", payroll.id)
      .eq("user_id", id)
      .gte("created_at", new Date().toISOString().split("T")[0]) // Fecha de inicio del día actual
      .lt("created_at", new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]) // Inicio del siguiente día
      .limit(1);

      if (currentPunchError) {
        console.error("Error fetching current punch:", currentPunchError.message);
        return { success: false };
      }

      if (!currentPunch || currentPunch.length === 0) {
        return { success: true, code: 102 };
      }

      if(currentPunch[0].lunch_out !== null){
        return { success: false, code: 106 };
      }

      if(currentPunch[0].out !== null){
        return { success: false, code: 107 };
      }

      const { data: updatedPunch, error: updateError } = await admin
      .from("schedule-checks")
      .update({
        lunch_out: fechaActual,
        photo_lunch_out: uploadedFile
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
    
    const profile = await getProfile(id);
    if(profile === null) return { success: false };

   profile.hora = dateFormatted;
   console.log(profile);
    return { success: true, data: profile };
  }

  if(type === "entrada_almuerzo"){
      const { data: currentPunch, error: currentPunchError } = await admin
      .from("schedule-checks")
      .select("*")
      .eq("payroll_id", payroll.id)
      .eq("user_id", id)
      .gte("created_at", new Date().toISOString().split("T")[0]) // Fecha de inicio del día actual
      .lt("created_at", new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]) // Inicio del siguiente día
      .limit(1);

      if (currentPunchError) {
        console.error("Error fetching current punch:", currentPunchError.message);
        return { success: false };
      }

      if (!currentPunch || currentPunch.length === 0) {
        return { success: true, code: 102 };
      }

      if(!currentPunch[0].lunch_out){
        return { success: false, code: 103 };
      }

      if(currentPunch[0].lunch_in !== null){
        return { success: false, code: 104 };
      }

      if(currentPunch[0].out !== null){
        return { success: false, code: 107 };
      }

      const { data: updatedPunch, error: updateError } = await admin
      .from("schedule-checks")
      .update({
        lunch_in: fechaActual,
        photo_lunch_in: uploadedFile
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
    
    const profile = await getProfile(id);
    if(profile === null) return { success: false };

   profile.hora = dateFormatted;
   console.log(profile);
    return { success: true, data: profile };
  }


  if(type === "salida"){
    const { data: currentPunch, error: currentPunchError } = await admin
    .from("schedule-checks")
    .select("*")
    .eq("payroll_id", payroll.id)
    .eq("user_id", id)
    .gte("created_at", new Date().toISOString().split("T")[0]) // Fecha de inicio del día actual
    .lt("created_at", new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]) // Inicio del siguiente día
    .limit(1);

    if (currentPunchError) {
      console.error("Error fetching current punch:", currentPunchError.message);
      return { success: false };
    }

    if (!currentPunch || currentPunch.length === 0) {
      return { success: true, code: 102 };
    }

    if(currentPunch[0].lunch_out !== null && !currentPunch[0].lunch_in){
      return { success: false, code: 105 };
    }

    if(currentPunch[0].lunch_out !== null){
      return { success: false, code: 107 };
    }

    const { data: updatedPunch, error: updateError } = await admin
    .from("schedule-checks")
    .update({
      out: fechaActual,
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
  
  const profile = await getProfile(id);
  if(profile === null) return { success: false };

 profile.hora = dateFormatted;
 console.log(profile);
  return { success: true, data: profile };
}

return { success: false};
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

const getPayroll = async () => {
  const { data: payrollData, error: payrollError } = await admin
  .from("payroll")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(1);

if (payrollError) {
  console.error("Error fetching payroll:", payrollError);
  return null;
}

let payroll = payrollData?.[0];

if (!payroll) {
  const payrollResult = await createPayroll();
  if (!payrollResult.success || !payrollResult.data) {
    return { success: false };
  }
  payroll = payrollResult.data;
}

return payroll;
}

const getProfile = async (id: string) => {
  const { data: profiles, error: profileError } = await admin
  .from("profiles")
  .select("*")
  .eq("id", id)
  .limit(1);

if (profileError) {
  console.error("Error fetching profile:", profileError.message);
  return null;
}

if (!profiles || profiles.length === 0) {
  console.error("No profile data returned after update.");
  return null;
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
return profile;

}