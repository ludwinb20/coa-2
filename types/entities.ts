export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
  users: User[];
}

export interface Company {
  id: string;
  name: string;
  departments: Department[];
} 