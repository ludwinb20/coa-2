import { IconProps } from "@/icons/type";
import { ComponentType } from "react";


export interface Route {
    id: number;
    title: string;
    href?: string;
    icon?: ComponentType<IconProps>;
    children?: Route[];
    duplicated?: boolean;
    space?: boolean;
  }