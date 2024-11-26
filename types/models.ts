import { StringToBoolean } from "class-variance-authority/types";
import { UUID } from "crypto";

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

  export type Campo = {
    id : number;
    proyecto_id : number;
    cliente_id : number;
    fecha_inicio: Date;
    fecha_final: Date;
    clients?:{
      id: number;
    name: string;
    rtn: string;
    created_at: string;
    file: string | null;
    }
  }

  export type CampoAssets = {
    id : number;
    campo_id : number;
    asset_id: number;
    estado: boolean;
    usuario_id: UUID;

  }

  export type CampoUsuarios = {
    id: number;
    encargado:string;
    campo_id:number;
    usuario_id:UUID;
  }

  export type Campologs = {
    id : number;
    campo_id : number;
    evento: string;
    observaciones: string;
    asset_id : number;
    usuario_id: UUID;
  }