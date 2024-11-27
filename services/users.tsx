import { Departamento, Role, UserProfile } from "@/types/models";
import { uploadFile } from "@/utils/handle-files";
import { createClient } from "@/utils/supabase/client";
import { createUser, getUsers as getUsersAdmin, updateUserEmail } from "@/utils/supabase/admin";
const supabase = createClient();

export const getUsers = async ({ empresa_id }: { empresa_id: number | null }) => {
  try {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*, departments(name), roles(name)")
    .eq("empresa_id", empresa_id)
    .eq("active", true);

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }
    
    const result = await getUsersAdmin();

    if(!result) return [];

  const usersWithUrls = await Promise.all(
    (profiles || []).map(async (profile: UserProfile) => {
      const matchingUser = result.users.find((user: any) => user.id === profile.id);

      if (!profile.avatar_url) {
        return { ...profile, email: matchingUser?.email, url: null };
      }

      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("avatars")
        .createSignedUrl(`users/${profile.avatar_url}`, 3600);

      if (signedUrlError || !signedUrlData) {
        console.error(`Error creating signed URL for ${profile.avatar_url}:`, signedUrlError?.message);
        return { ...profile, email: matchingUser?.email, url: null };
      }

      return { ...profile, email: matchingUser?.email, url: signedUrlData.signedUrl };
    })
  );

  return usersWithUrls;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createUsers = async ({
  company_id,
  full_name,
  role_id,
  department_id,
  file,
  email,
  password
}:{
  company_id: number;
  full_name: string;
  role_id: number;
  department_id: number;
  file?: File;
  email: string;
  password: string;
}): Promise<{user: UserProfile | null; success: boolean}> => {
  try{
      let  uploadedFile: string | null = null;
      
      if(file){
        const result = await uploadFile({bucket: "avatars", url: "users", file: file});
        if(result.success) uploadedFile = result.data;
      }
      
      const user = await createUser({email, password});

      if(!user){
        return { user: null, success: false };
      }


    const result = await supabase.from("profiles").update({
        empresa_id: company_id,
        full_name: full_name,
        rol_id: role_id,
        departamento_id: department_id,
        avatar_url: uploadedFile,
      }).eq("id", user.user?.id);

      const { data, error } = result;
    if (error) {
      console.log("Error creando usuario:", error);
      return { user: null, success: false };
    }

    // return { user: null, success: false };

    return { user: data, success: true };
  }catch(error){
    console.log(error)
    return { user: null, success: false };
  }
}

export const getRoles = async (): Promise<Role[]> => {
  const { data, error } = await supabase
    .from("roles")
    .select("*");

  if (error) {
    console.error("Error fetching roles:", error);
    return [];
  }

  return data;
};

export const getDepartments = async (): Promise<Departamento[]> => {
  const { data, error } = await supabase
    .from("departments")
    .select("*");

  if (error) {
    console.error("Error fetching departments:", error);
    return [];
  }

  return data;
};

export const updateUser = async ({
  id,
  full_name,
  rol_id,
  departamento_id,
  file,
  email,
  email_old,
}:{
  id: string;
  full_name: string;
  rol_id: number;
  departamento_id: number;
  file: File | string | null;
  email: string;
  email_old: string;
}): Promise<{user: UserProfile | null; success: boolean}> => {
  try{
      let filefiltrado: string | null = null;
      if(!file || typeof file === "string"){
          filefiltrado = file;
      }else{
          const result = await uploadFile({bucket: "avatars", url: "clients", file: file});
          if(result.success) filefiltrado = result.data;
      }
      
      if(email_old != email){
        const response = await updateUserEmail({email, id});

        if(!response){
          return { user: null, success: false };
        }
      }

    const result = await supabase.from("profiles").update({
        full_name: full_name,
        rol_id: rol_id,
        departamento_id: departamento_id,
        avatar_url: filefiltrado,
      }).eq("id", id);

      const { data, error } = result;

    if (error) {
      console.log("Error creando usuario:", error);
      return { user: null, success: false };
    }

    // return { user: null, success: false };

    return { user: data, success: true };
  }catch(error){
    console.log(error)
    return { user: null, success: false };
  }
}

export const deleteUser = async ({
  id,
}: {
  id: string;
}): Promise<{user: UserProfile | null; success: boolean}> => {
  try{
    const { data, error } = await supabase
    .from("profiles")
    .update({
        active: false
    })
    .eq("id", id);

    if (error) {
      console.log("Error eliminando cliente:", error);
      return { user: null, success: false };
    }

    return { user: data, success: true };
  }catch(error){
    console.log(error)
    return { user: null, success: false };
  }
}

export const sendResetPassowrd = async ({email}:{email: string}) => {
  try{
    const result = await supabase.auth.resetPasswordForEmail(email);
    console.log(result);
    if (result.error) {
      console.error('Error resetting password:', result.error);
      return false;
    }

    return true;
  }catch(error){
    console.log(error)
    return false;
  }
}
