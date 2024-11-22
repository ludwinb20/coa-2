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


  export type Category = {
    id: number;
    nombre: string;
    company_id: number;
    created_at: string;
    descripcion: string;
  };