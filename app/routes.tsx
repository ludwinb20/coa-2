import { Route } from "@/types/utils"
import {
  AccountCircleIcon,
    HomeIconLaravel,
  } from "@/icons/icons";

export const routes: Route[] = [
    {
      id: 1,
      title: "Inicio",
      href: "/dashboard",
      icon: HomeIconLaravel,
      space: false,
    },
    {
      id: 2,
      title: "Clientes",
      href: "/dashboard/clients",
      icon: AccountCircleIcon,
      space: false,
    }
]