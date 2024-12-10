"use client";
import { useSession } from "@/app/session-provider";
import AbsencesCreate from "@/components/ausencias/create";
import { getAbsenceCategories } from "@/services/absences";
import { useEffect, useState } from "react";
import { AbsenceCategory } from "@/types/models";


const AbsencesPage = () => {
    const { user } = useSession();

    const [categories, setCategories] = useState<AbsenceCategory[]>([]);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const result = await getAbsenceCategories();
          setCategories(result ?? []);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
  
      fetchCategories();
    }, []);

  return (
    <AbsencesCreate categories={categories ?? []}/>
  );
};

export default AbsencesPage;