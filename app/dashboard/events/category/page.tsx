"use client";
import { useSession } from "@/app/session-provider";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/services/events";
import CategorysIndex from "@/components/events/category/category-index";




export default function Categorys() {
  const { user } = useSession();
  const { data: category, isLoading } = useQuery({
    queryKey: ["categorys", user?.id],
    queryFn: () => getCategories({}),
  });

  

  
  return (
    <div className="">
      {isLoading ? (
        <div>Cargando activos...</div>
      ) : (
      <CategorysIndex categorys={category ?? []} />
    )}
    </div>
  );
}