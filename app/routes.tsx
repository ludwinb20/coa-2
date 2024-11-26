import { Route } from "@/types/utils"
import {
  AccountCircleIcon,
    HomeIconLaravel,
    InventoryIcon,
  } from "@/icons/icons";
import rolesPermsisssions from "@/utils/roles";

export const routes: Route[] = [
    {
      id: 1,
      title: "Inicio",
      href: "/dashboard",
      icon: HomeIconLaravel,
      space: false,
      roles: [1, 2, 3, 4, 5],
    },
    {
      id: 2,
      title: "Clientes",
      href: "/dashboard/clients",
      icon: AccountCircleIcon,
      space: false,
      roles: rolesPermsisssions.access_clients_index,
    },
    {
      id: 3,
      title: "Gestion de Activos",
      //href: "/dashboard/asset_Management",
      icon: InventoryIcon,
      space: false,
      roles: [1, 2, 3, 4],
      children: [
        {
          id: 4,
          title: "Activos",
          href: "/dashboard/asset_Management",
          icon: InventoryIcon,
          space: false,
          roles: [1, 2, 3, 4],
        },
        {
          id: 5,
          title: "Categorias",
          href: "/dashboard/category",
          icon: InventoryIcon,
          space: false,
          roles: [1, 2, 3, 4],
        },
      ],
    },
    {
      id: 2,
      title: "Recurso humano",
      href: "/dashboard/users",
      icon: AccountCircleIcon,
      space: false,
      roles: rolesPermsisssions.access_clients_index,
    },
    {
      id: 4,
      title: "Icons",
      href: "/dashboard/icons",
      icon: InventoryIcon,
      space: false,
      roles: [1, 2, 3, 4],
    },
    {
      id: 6,
      title: "QR",
      href: "/dashboard/QR",
      icon: InventoryIcon,
      space: false,
      roles: [1, 2, 3, 4],
    },
    {
      id: 7,
      title: "Salidas a Campo",
      href: "/dashboard/salidas",
      icon: InventoryIcon,
      space: false,
      roles: [1, 2, 3, 4],
    },
    
]