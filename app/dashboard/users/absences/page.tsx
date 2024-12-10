"use client";
import { useSession } from "@/app/session-provider";
import AusenciasIndex from "@/components/ausencias";
import { getAusencias } from "@/services/absences";
import { useQuery } from "@tanstack/react-query";


const AbsencesPage = () => {
    const { user } = useSession();

    const { data: ausencias, isLoading } = useQuery({
        queryKey: ["ausencias", user?.id],
        queryFn: () => getAusencias(user?.id ?? null, user?.profile.rol_id ?? null),
      });

  return (
    <AusenciasIndex ausencias={ausencias ?? []} />
  );
};

export default AbsencesPage;