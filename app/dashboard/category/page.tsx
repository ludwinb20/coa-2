"use client";
import { useSession } from "@/app/session-provider";

import { useQuery } from "@tanstack/react-query";
import CategoryIndex from "@/components/category/category-index";
import { getCategories } from "@/services/category";



export default function Categorys() {
  const { user } = useSession();
  const { data: category, isLoading } = useQuery({
    queryKey: ["category", user?.id],
    queryFn: () => getCategories({ empresa_id: user?.empresa.id ?? null }),
  });

  

  
  return (
    <div className="">
      {isLoading ? (
        <div>Cargando activos...</div>
      ) : (
      <CategoryIndex categorys={category ?? []} />
    )}
    </div>
  );
}
