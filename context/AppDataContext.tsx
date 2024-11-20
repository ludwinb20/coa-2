'use client';

import { fetchCompanies, fetchDepartments, fetchProfiles, fetchRoles } from '@/utils/supabase/queries';
import { createContext, useContext, useEffect, useState } from 'react';


interface AppDataContextType {
  departments: any[];
  roles: any[];
  companies: any[];
  profiles: any[];
  loading: boolean;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [departmentsData, rolesData, companiesData, profilesData] = await Promise.all([
        fetchDepartments(),
        fetchRoles(),
        fetchCompanies(),
        fetchProfiles(),
      ]);

      setDepartments(departmentsData);
      setRoles(rolesData);
      setCompanies(companiesData);
      setProfiles(profilesData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <AppDataContext.Provider value={{ departments, roles, companies, profiles, loading }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}; 