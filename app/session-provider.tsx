'use client';
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { UserFront } from "@/types/users";

interface SessionContextProps {
  user: UserFront | null; 
}

const SessionContext = createContext<SessionContextProps>({
  user: null,
});

export const useSession = () => useContext(SessionContext);

interface SessionContextProviderProps {
  children: ReactNode;
  user: UserFront | null;
}

export function SessionProvider({children, user}: SessionContextProviderProps) {
  const [userData, setUserData] = useState<UserFront | null>(user);

  // Aquí podrías manejar la lógica asincrónica si es necesario
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const userData = await getUser(); // Llama a tu función asincrónica aquí
  //     setUserData(userData);
  //   };

  //   if (!user) {
  //     fetchUser();
  //   }
  // }, [user]);

  return (
    <SessionContext.Provider value={{ user: userData }}>
      {children}
    </SessionContext.Provider>
  );
}

