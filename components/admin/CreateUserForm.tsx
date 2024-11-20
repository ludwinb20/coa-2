'use client';

import React, { useEffect, useState } from 'react';
import { fetchDepartments, fetchRoles } from '@/utils/supabase/queries';

export const DepartmentsList = () => {
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await fetchDepartments()
      setDepartments(data);
    };

    loadDepartments();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Departamentos</h2>
      <ul>
        {departments.map((department) => (
          <li key={department.id}>{department.name}</li>
        ))}
      </ul>
    </div>
  );
};
