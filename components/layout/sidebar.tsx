"use client";

import { UserFront } from "@/types/users";
import { LinkWithChildren, LinkWithoutChildren } from "./sidebar-routes";
import { routes } from "@/app/routes";
import Link from "next/link";
import Image from "next/image";

interface Props {
  user: UserFront | null;
}

export function SideBarMenu({ user }: Props) {
    if(!user){
        return null;
    }
  return (
    <aside
      id="default-sidebar"
      className="w-full h-full flex flex-col"
      aria-label="Sidebar"
    >
      <Link
        className="flex items-center gap-x-2 flex-[0_0_auto] border-b"
        href={"/dashboard"}
      >
        <div className="ml-[24px] flex gap-x-1 items-center mt-5 mb-2">
          {/* <img src="/landing-logo.png" alt="" className="h-[24px]" /> */}
          <Image
            src="/logo.png"
            alt="logo"
            className="h-[24px] block dark:hidden"
            width={24}
            height={24}
          />
          <Image
            src="/logo.png"
            alt="logo"
            className="h-[24px] hidden dark:block"
            width={24}
            height={24}
          />
          <h1 className="font-semibold text-xl">Portal Devio</h1>
        </div>
      </Link>
      <ul className="flex-[1_1_auto] overflow-y-auto px-2 pt-2 pb-20">
        {routes.map((route) => (
          <li key={route.id} className={`${route.space ? "mb-6" : ""}`}>
            {route.children && route.children.length > 0 ? (
              <LinkWithChildren route={route}/>
            ) : (
              <LinkWithoutChildren route={route} />
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
