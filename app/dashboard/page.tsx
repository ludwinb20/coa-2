// app/admin/page.tsx

import { DepartmentsList } from "@/components/admin/CreateUserForm";


export default function DepartmentsPage() {
  return (
    <div className="p-6">
      <DepartmentsList />
    </div>
  );
}