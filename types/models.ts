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

  export type Asset = {
    id: number;
    nombre: string;
    estado: string;
    precio: number;
    categoria_id: number;
    fotografia: string;
    disponibilidad: boolean;
    company_id: number;
    created_at: string;
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
