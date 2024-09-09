import { Route } from "@/types/utils"
import {
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
]