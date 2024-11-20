// app/admin/page.tsx
"use client";
import { DepartmentsList } from "@/components/admin/CreateUserForm";

export default function DepartmentsPage() {

  return (
    <div className="p-6">
      <DepartmentsList />
    </div>
  );
}