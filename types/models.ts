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

export type UserProfile = {
    id: string;
    full_name: string;
    username?: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    empresa_id: number;
    rol_id: number;
    departamento_id: number;
    roles: Role | null;
    avatar_url: string;
    url?: string | null;
    email?: string;
    password?: string;
    departments?: Departamento | null;
  };

export type Role = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };

export type Category = {
    id: number;
    nombre: string;
    company_id: number;
    created_at: string;
    descripcion: string;
  };



export type Client = {
  id: number;
  name: string;
  rtn: string;
  created_at: string;
  file: string | null;
  url?: string | null;
};

export type Departamento = {
  id: number;
  company_id: number;
  name: string;
  code: string;
  created_at: string;
  active: boolean;
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
    profiles: any;
    id : number;
    campo_id : number;
    asset_id: number;
    assets?:{
      id: number;
      nombre: string;
      file: string | null;
      url?: string | null;
      precio: number;
      categoria_id: number;
      disponibilidad: boolean;
      company_id: number;
      created_at: string;
    estado: boolean;
    usuario_id: UUID;
    profiles?:{
    id: UUID;
    full_name: string;
    username?: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    empresa_id: number;
    rol_id: number;
    departamento_id: number;
    roles: Role | null;
    avatar_url: string;
    url?: string | null;
    email?: string;
    password?: string;
    departments?: Departamento | null;
    }
    }
  }

  export type CampoUsuarios = {
    id: number;
    encargado:string;
    campo_id:number;
    usuario_id:UUID;
    profiles?:{
      id: UUID;
      username: string;
      full_name: string;
      avatar_url: string;
      url?: string | null; 
    }
  
  }

  export type Campologs = {
    id : number;
    campo_id : number;
    evento: string;
    observaciones: string;
    asset_id : number;
    usuario_id: UUID;
    fecha:Date;
  }
