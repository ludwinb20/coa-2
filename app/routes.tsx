import { Route } from "@/types/utils"
import {
  AccountCircleIcon,
    HomeIconLaravel,
    InventoryIcon,
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
    },
    {
      id: 3,
      title: "Gestion de Activos",
      //href: "/dashboard/asset_Management",
      icon: InventoryIcon,
      space: false,
      children: [
        {
          id: 4,
          title: "Activos",
          href: "/dashboard/asset_Management",
          icon: InventoryIcon,
          space: false,
        },
        {
          id: 5,
          title: "Categorias",
          href: "/dashboard/category",
          icon: InventoryIcon,
          space: false,
        },
      ],
    }
]