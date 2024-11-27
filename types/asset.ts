export type Asset = {
    id: number;
    nombre: string;
    estado: string;
    precio: number;
    categoria_id: number;
    file: string | null;
    url?: string | null;
    disponibilidad: boolean;
    company_id: number;
    created_at: string;
    category?: {
      id: number;
      nombre: string;
      descripcion: string;
    };
    fotografia: string;
  };