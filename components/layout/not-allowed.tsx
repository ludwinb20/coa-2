import React from "react";

const NotAllowed: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-red-500">403 - Acceso Denegado</h1>
      <p className="text-primary mt-4 text-lg">
        Lo sentimos, no tienes permisos para acceder a esta página.
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
      >
        Volver
      </button>
    </div>
  );
};

export default NotAllowed;
