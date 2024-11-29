import { subDays, addDays } from "date-fns";

export const options: {
    [key: string]: () => {
      start: string;
      end: string;
    };
  } = {
    Hoy: () => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      return {
        start: date.toISOString(),
        end: addDays(date, 1).toISOString(),
      };
    },
    Ayer: () => {
      const date = subDays(new Date(), 1);
      date.setHours(0, 0, 0, 0);
      return {
        start: date.toISOString(),
        end: addDays(date, 1).toISOString(),
      };
    },
    "Últimos 7 días": () => {
      const start = subDays(new Date(), 7);
      start.setHours(0, 0, 0, 0);
      return {
        start: start.toISOString(),
        end: new Date().toISOString(),
      };
    },
    "Últimos 30 días": () => {
      const start = subDays(new Date(), 30);
      start.setHours(0, 0, 0, 0); // Establecer al inicio del día hace 30 días
      const end = new Date();
      end.setHours(23, 59, 59, 999); // Establecer al final del día actual
      return {
        start: start.toISOString(),
        end: end.toISOString(),
      };
    },
    "Próximos": () => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = addDays(start, 30);
      end.setHours(23, 59, 59, 999);
      return {
        start: start.toISOString(),
        end: end.toISOString(),
      };
    },
};