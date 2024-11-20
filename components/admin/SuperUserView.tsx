import { useState } from 'react';
import { CreateUser } from './CreateUser';
import { Company, Role, User } from '@/types/entities';

interface SuperUserViewProps {
  companies: Company[];
  roles: Role[];
}

export const SuperUserView = ({ companies, roles }: SuperUserViewProps) => {
  const [users, setUsers] = useState<User[]>([]);

  const handleCreateUser = (newUser: { name: string; email: string; role: Role; departmentId: string }) => {
    const department = companies.flatMap(company => company.departments).find(dept => dept.id === newUser.departmentId);
    if (department) {
      const user: User = { id: `${Date.now()}`, ...newUser };
      setUsers([...users, user]);
      department.users.push(user);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Vista de Superusuario</h1>
      <CreateUser companies={companies} roles={roles} onCreate={handleCreateUser} />
      <div className="mt-8">
        <h2 className="text-xl font-bold">Usuarios Existentes</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name} - {user.email} - {user.role.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 