"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDownIcon, PersonIcon } from "@radix-ui/react-icons";
import { Switch } from "../ui/switch";
import { useTheme } from "next-themes";
import {signOut} from "@/app/login/actions";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/session-provider";
import { LogOut, PlusIcon } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import { toast } from "sonner";
import { UserFront } from "@/types/users";


interface Props {
  user: UserFront;
}

export const ProfileDropdown = ({}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const {user} = useSession();

  const firstLetter = user?.profile?.full_name?.toUpperCase() ?? "NA";
  const router = useRouter();

  if (!user || !user.profile) return <p>Cargando...</p>;

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const onAddAccount = () => {
    setLoginOpen(true);
  };

  console.log('User:', user);

  return (
    <>
      <DropdownMenu
        dir="ltr"
        modal={false}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex gap-x-2 px-4" size="lg">
            <Avatar className="h-8 w-8 relative">
              <AvatarImage
                className="rounded-full"
                src={user?.empresa?.nombre as string}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {firstLetter}
              </AvatarFallback>
            </Avatar>
            <p className="leading-7">{user?.profile?.username || "Usuario Anónimo"}</p>
            <ChevronDownIcon className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side={"bottom"} className="w-56">
          <DropdownMenuItem onSelect={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <div className="flex px-1 py-2">
              <label htmlFor="theme-switch" className="text-sm w-full">
                Modo oscuro
              </label>
              <Switch
                id="theme-switch"
                checked={theme == "dark"}
                onCheckedChange={(on: any) => {
                  const theme = on ? "dark" : "light";
                  setTheme(theme);
                }}
              />
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
