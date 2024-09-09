import { useState } from "react";

export const useHome = () => {
    const [codigo, setcodigo] = useState<string>('');
    const enviarCodigo = () => {
    }
    return {
        enviarCodigo,
        codigo,
        setcodigo
    };
  };