"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/app/session-provider";
import NotAllowed from "@/components/layout/not-allowed";
import UsersCreate from "@/components/users/users-create";
import { getDepartments, getRoles } from "@/services/users";
import rolesPermissions from "@/utils/roles";
import { Departamento, Role } from "@/types/models";

export default function UsersCreatePage() {
  const { user } = useSession();
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, departmentsData] = await Promise.all([
          getRoles(),
          getDepartments(),
        ]);
        setRoles(rolesData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching roles or departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (user && !rolesPermissions.clients_create.includes(user?.profile.rol_id)) {
    return <NotAllowed />;
  }

  if (loading) {
    return <div>Loading...</div>; // Or any loading spinner/component
  }

  return (
    <div className="">
      <UsersCreate roles={roles} departments={departments} />
    </div>
  );
}
