"use client";
import { useSession } from "@/app/session-provider";
import AbsencesCreate from "@/components/ausencias/create";
import { getAbsenceCategories } from "@/services/absences";


const AbsencesPage = async () => {
    const { user } = useSession();

    const categories = await getAbsenceCategories();

  return (
    <AbsencesCreate categories={categories ?? []}/>
  );
};

export default AbsencesPage;