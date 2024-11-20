import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { Company, Department, Role } from '@/types/entities';
import { Select } from '../ui/select';

interface CreateUserProps {
  companies: Company[];
  roles: Role[];
  onCreate: (user: { name: string; email: string; role: Role; departmentId: string }) => void;
}

export const CreateUser = ({ companies, roles, onCreate }: CreateUserProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const handleCreate = () => {
    if (name && email && selectedRole && selectedDepartment) {
      onCreate({ name, email, role: selectedRole, departmentId: selectedDepartment });
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Crear Nuevo Usuario</h2>
      <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Select
        placeholder="Seleccionar Rol"
        options={roles.map(role => ({ value: role.id, label: role.name }))}
        onChange={(value) => setSelectedRole(roles.find(role => role.id === value) || null)}
      />
      <Select
        placeholder="Seleccionar Departamento"
        options={companies.flatMap(company => company.departments.map(dept => ({ value: dept.id, label: `${company.name} - ${dept.name}` })))}
        onChange={(value) => setSelectedDepartment(value)}
      />
      <Button onClick={handleCreate} className="mt-4">Crear Usuario</Button>
    </div>
  );
}; 