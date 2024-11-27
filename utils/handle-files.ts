import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { nullable } from "zod";

const supabase = createClient();

const getFileExtension = (fileName: string) => {
  const fileNameSplit = fileName.split('.')
  return fileNameSplit[fileNameSplit.length - 1]
}

export const uploadFile = async ({bucket, url, file}:{bucket: string, url:string, file: File}) => {
  try {
    const fileExtension = getFileExtension(file.name);
    const name = `${uuidv4()}.${fileExtension}`;

    const direccion = url ? `${url}/${name}` : name;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(direccion, file, {
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

export const deleteFile = async ({bucket, url}:{bucket: string, url:string}) => {
  try {
    let array : string[] = [];
    array.push(url);
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(array);

      console.log('File deleted:', data, 'Error:', error);
      
      if (error) {
        console.log('Error deleting file: ', error);
        return {data: null, success: false};
      }

      return  {data: null, success: true};
  } catch (error) {
      console.log('Error deleting file: ', error);
      return {data: null, success: false};
  }
}