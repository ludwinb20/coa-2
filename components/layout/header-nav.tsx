import { ProfileDropdown } from "./profile-dropdown";
import { ReactNode } from "react";
import { UserFront } from "@/types/users";
import Link from "next/link";

interface Props {
  centerChildren?: ReactNode;
  session: UserFront | null;
}

export function HeaderNav({ centerChildren, session }: Props) {
  if (!session) return null;

  return (
    <div className="w-full h-14 px-4 py-2 flex justify-end border-b bg-background">
      {centerChildren && centerChildren}
      <div className="flex items-center gap-x-2">
        <ProfileDropdown user={session} />
      </div>
    </div>
  );
}
