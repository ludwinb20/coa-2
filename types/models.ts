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
  rtn?: string;
  company_id?: number;
  active?: boolean;
  file?: string;
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
    estado: string;
    events?:{
      id: number;
      nombre: string;
      fecha_inicio: Date;
      fecha_final: Date;
      categoria: string;
      creador_evento: string;
      client_id: number;
      notas: string;
    }
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
    estado: string;
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
        usuario_id: string;
    profiles?:{
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
    }
    }
  }

  export type CampoUsuarios = {  
    id: number;
    encargado:string;
    campo_id:number;
    usuario_id:string;
    profiles?:{
      id: string;
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
    usuario_id: string;
    fecha:Date;
  }

  export type Marcajes = {
    id: number;
    in: Date;
    out: Date;
    total: number;
    profile: Profile;
  }

export type Payroll = {
    id: string;
    created_at: Date;
    start: Date;
    end: Date;
  };

export type scheduleCheck = {
  id: string;
  payroll_id: string;
  user_id: string;
  in: Date;
  out: Date;
  total: number;
  in_photo: string | null;
  out_photo: string | null;
  hora? : string;
  url?: string | null;
};
  export type Incidencia = {
    id: number;
    campo_id: number;
    observacion: string;
    file: string | null;
  }

  export type Event = {
    campo?: {
        id: number;
        proyecto_id: number;
        cliente_id: number;
        fecha_inicio: Date;
        fecha_final: Date;
        estado: string;
    };
    id?: number;
    nombre: string;
    fecha_inicio: Date;
    fecha_final: Date;
    categoria: string;
    creador_evento: string;
    client_id: number;
    notas: string;
    profiles?: {
        full_name: string;
    };
    clients?: {
        id: number;
        name: string;
        file?: string;
        url?: string | null;
    };
  }

export type Events_category = {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: Date;
}

export type Event_file = {
  id: number;
  event_id: number;
  file: string;
}

export type Encargados = {
  id?: number;
  evento_id: number;
  usuario_id: string;
  profiles?: {
      id: string;
      full_name: string;
      avatar_url?: string;
      url?: string | null;
  };
};

interface EventFile {
  id: number;
  url: string;
  name: string;
  type: string;
}

export type Ausencia = {
  id: number;
  start: Date;
  end: Date;
  user_id: string;
  profile?: Profile;
  type: string;
  status: string;
  created_at: Date;
  file: File | null;
}

export interface AbsenceCategory {
  id: number;
  nombre: string;
  created_at: Date;
  rango: number | null;
  documentacion_requerida: boolean;
  anticipacion: number | null;
  maximo_mensual: number | null;
}


export type Project = {
  id?: number;
  nombre: string;
  cliente_id: number;
  categoria_id: number;
}

export type ProjectCategory = {
  id?: number;
  nombre: string;
  descripcion: string;
  
}

export type Tarea = {
  id: number;
  nombre: string;
  descripcion: string;
  proyecto_id?: number | null;
  creador: string;
  encargado: string;
  prioridad: 'baja' | 'media' | 'alta';
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
  fecha_inicio: Date;
  fecha_final: Date;
  file?: string | null;
  url?: string | null;
  profiles_encargado?: {
    id: string;
    full_name: string | null;
    avatar_url?: string | null;
  } | null;
  profiles_creador?: {
    id: string;
    full_name: string | null;
    avatar_url?: string | null;
  } | null;
  avatarUrl?: string | null;
  creadorAvatarUrl?: string | null;
};

export type TareaFile = {
  id: number;
  tarea_id: number;
  file: string;
  url?: string | null;
};

export type SubTarea = {
  id: number;
  tarea_id: number;
  nombre: string;
  descripcion: string;
} 
