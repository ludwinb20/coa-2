import { useState, useEffect } from 'react';
import { getDepartments, getRoles } from '@/services/users';
import { Departamento, Role } from '@/types/models';

const useUsers = () => {
  const [roles, setRoles] = useState<Role[]>([]); 
  const [departments, setDepartments] = useState<Departamento[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRoles = await getRoles();
        const fetchedCompanies = await getDepartments();
        setRoles(fetchedRoles);
        setDepartments(fetchedCompanies);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { roles, departments, loading, error };
};

export default useUsers;
