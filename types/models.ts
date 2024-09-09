import { StringToBoolean } from "class-variance-authority/types";

export type Empresa = {
    id: number;
    created_at: string;
    updated_at: string;
    nombre: string;
    subdominio: string;
  };

export type Profile = {
    id: string;
    empresa_id: number;
    username: string;
    full_name: string;
    avatar_url: string;
  };