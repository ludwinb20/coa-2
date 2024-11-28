import { Route } from "@/types/utils"
import {
  AccountCircleIcon,
    BadgeIcon,
    CalendarIcon,
    HomeIconLaravel,
    InventoryIcon,
    PeopleIcon,
    UserIcon,
    WalletLaravelIcon,
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
      id: 10,
      title: "Recurso humano",
      icon: PeopleIcon,
      space: false,
      roles: rolesPermsisssions.access_clients_index,
      children: [
        {
          id: 11,
          title: "Usuarios",
          href: "/dashboard/users",
          icon: UserIcon,
          space: false,
          roles: rolesPermsisssions.access_clients_index,
        },
        {
          id: 12,
          title: "Marcajes",
          href: "/dashboard/users/marcajes",
          icon: BadgeIcon,
          space: false,
          roles: [1, 2, 3, 4],
        },
      ],
    },
    {
      id: 7,
      title: "Icons",
      href: "/dashboard/icons",
      icon: WalletLaravelIcon,
      space: false,
      roles: [1, 2, 3, 4],
    },
    {
      id: 8,
      title: "QR",
      href: "/dashboard/QR",
      icon: InventoryIcon,
      space: false,
      roles: [1, 2, 3, 4],
    },
    {
      id: 9,
      title: "Salidas a Campo",
      href: "/dashboard/salidas",
      icon: InventoryIcon,
      space: false,
      roles: [1, 2, 3, 4],
    },
    
]