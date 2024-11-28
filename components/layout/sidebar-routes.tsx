"use client";

import { Route } from "@/types/utils";
import { IconProps } from "@/icons/type";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentType, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/app/session-provider";
import { isArray } from "util";

const MotionLink = motion(Link);

interface NestedLinkProps {
  href: string;
  name: string;
  icon: ComponentType<IconProps>;
  isLast: boolean;
}

function NestedLink({ href, name, icon }: NestedLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = icon;

  return (
    <MotionLink
      href={href}
      className={cn(
        "relative flex items-center gap-x-2 px-6 py-2 rounded-md text-muted-foreground transition-all duration-200 ml-4",
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "hover:bg-secondary"
      )}
      whileHover={{ scale: 1.02 }}
      initial={{ scale: 1 }}
    >
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="bg-primary absolute left-0 top-0 h-full w-0.5"
          transition={{ duration: 0.3 }}
        />
      )}
      <Icon className="w-5 h-5" />
      <span className="truncate">{name}</span>
    </MotionLink>
  );
}

interface PlainLinkProps {
  href: string;
  name: string;
  icon: ComponentType<IconProps>;
  space?: boolean;
  duplicated?: boolean;
  roles: number[];
}

function PlainLink({
  href,
  name,
  icon,
  space,
  duplicated = false,
  roles,
}: PlainLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = icon;
  const { user } = useSession();

  if (!user) return null;

  const isAllowed = roles.includes(user.profile.rol_id);
  if (!isAllowed) return null;

  return (
    <MotionLink
      href={href}
      className={cn(
        "relative flex items-center gap-x-2 px-6 py-2 rounded-md transition-all duration-200",
        isActive && !duplicated
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-secondary"
      )}
      whileHover={{ scale: 1.02 }}
      initial={{ scale: 1 }}
    >
      {isActive && !duplicated && (
        <motion.div
          layoutId="active-indicator"
          className="bg-primary absolute left-0 top-0 h-full w-0.5"
          transition={{ duration: 0.3 }}
        />
      )}
      <Icon className="w-5 h-5" />
      <span className="truncate">{name}</span>
    </MotionLink>
  );
}

export function LinkWithChildren({ route }: { route: Route }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useSession();

  if (!user) return null;

  const isAllowed = route.roles.includes(user.profile.rol_id);
  if (!isAllowed) return null;

  return (
    <>
      <motion.button
        onClick={() => setIsExpanded((prev) => !prev)}
        className={cn(
          "flex items-center justify-between w-full px-6 py-2 rounded-md text-muted-foreground hover:bg-secondary transition-colors duration-200"
        )}
        aria-expanded={isExpanded}
        role="button"
        whileHover={{ scale: 1.02 }}
        initial={{ scale: 1 }}
      >
        <div className="flex items-center gap-x-2">
          {route.icon && <route.icon className="w-5 h-5" />}
          <span className="truncate">{route.title}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          className="transform transition-transform duration-200"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </motion.div>
      </motion.button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {Array.isArray(route.children) &&
              (route.children as Array<any>).map((child, idx) => (
                <li key={child.id}>
                  <NestedLink
                    href={child.href as string}
                    name={child.title}
                    icon={child.icon as ComponentType<IconProps>}
                    isLast={idx === route.children!.length - 1} // Aquí "!" asegura que no es undefined
                  />
                </li>
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}

export function LinkWithoutChildren({ route }: { route: Route }) {
  return (
    <PlainLink
      href={route.href as string}
      icon={route.icon as ComponentType<IconProps>}
      name={route.title}
      space={route.space}
      duplicated={route.duplicated}
      roles={route.roles}
    />
  );
}
