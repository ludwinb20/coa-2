"use client";
import { Route } from "@/types/utils";
import { IconProps } from "@/icons/type";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentType, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NestedLinkProps {
  href: string;
  name: string;
  space?: boolean;
  icon: ComponentType<IconProps>;
  isLast: boolean;
}

const MotionLink = motion(Link);
function NestedLink({
  href,
  name,
  icon,
}: NestedLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = icon;

  // if (laravel) {
  //   return (
  //     <a
  //       href={href}
  //       className={cn(
  //         "relative flex flex-row items-center py-2 focus:outline-none"
  //       )}
  //       // onMouseEnter={() => setIsHovered(true)}
  //       // onMouseLeave={() => setIsHovered(false)}
  //     >
  //       <span
  //         className={cn(
  //           "inline-flex justify-center items-center",
  //           // isHovered ? "ml-[42px]" : ""
  //         )}
  //       >
  //         {icon && <Icon className="w-6 h-6" />}
  //       </span>
  //       <span className="truncate  text-[15.4px] ">{name}</span>
  //     </a>
  //   );
  // }

  return (
    <MotionLink
      href={href}
      className={cn(
        "relative flex flex-row items-center transition-colors duration-200 delay-100 py-2 gap-x-2 px-4 rounded-md ml-6 bg-secondary text-secondary-foreground")}
      whileHover="hover"
      initial="rest"
    >
      {isActive && (
        <motion.div
          layoutId="follow"
          className={cn(
            "bg-primary z-20 absolute h-full w-0.5 left-0 top-0"
            // make a botton corner if it is the last element
          )}
          transition={{
            duration: 0.3,
          }}
        ></motion.div>
      )}
      {!isActive && (
        <div
          className={cn("bg-secondary z-10 w-0.5 h-full absolute left-0 top-0")}
        ></div>
      )}
      <motion.span
        className={cn(
          "inline-flex justify-center items-center z-20"
          // isHovered ? "ml-[35px]" : ""
        )}
        variants={slashMotion}
      >
        {icon && <Icon className="w-5 h-5" />}
      </motion.span>
      <span className="truncate  text-[15.4px] ">{name}</span>
    </MotionLink>
  );
}

interface PlainLinkProps {
  href: string;
  name: string;
  icon: ComponentType<IconProps>;
  space?: boolean;
  duplicated?: boolean;
}

const slashMotion = {
  rest: { scale: 1 },
  hover: {
    scale: 1.2,
    rotate: 8,
  },
};

function PlainLink({
  href,
  name,
  icon,
  space,
  duplicated = false,
}: PlainLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = icon;

  return (
    <MotionLink
      href={href}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-row items-center transition-colors duration-200 delay-100 py-2 gap-x-2 px-4 mb-2 rounded-md",
        isActive && !duplicated
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-secondary"
      )}
      whileHover="hover"
      initial="rest"
    >
      {isActive && !duplicated && (
        <motion.div
          layoutId="follow"
          className="bg-primary w-0.5 h-full absolute left-0 top-0"
          transition={{
            duration: 0.3,
          }}
        ></motion.div>
      )}
      <motion.span
        className={cn(
          "inline-flex justify-center items-center z-20"
          // isHovered ? "ml-[35px]" : ""
        )}
        variants={slashMotion}
      >
        {icon && <Icon className="w-5 h-5" />}
      </motion.span>
      <span className="truncate z-20">{name}</span>
    </MotionLink>
  );
}

export function LinkWithChildren({
  route,
}: {
  route: Route;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  return (
    <>
      <motion.button
        onClick={() => setIsExpanded((prev) => !prev)}
        className={cn(
          "flex flex-row items-center py-2 rounded-md focus:outline-none transition-colors duration-300 px-4 border-transparent w-full justify-between text-muted-foreground hover:bg-secondary"
        )}
        whileHover="hover"
        initial="rest"
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "w-fit inline-flex justify-center items-center"
            // isHovered ? "ml-[35px]" : ""
          )}
        >
          <motion.span
            className={cn(
              "inline-flex justify-center items-center z-20"
              // isHovered ? "ml-[35px]" : ""
            )}
            variants={slashMotion}
          >
            {route.icon && <route.icon className="w-5 h-5" />}
          </motion.span>
          <span className={cn("ml-4 truncate")}>{route.title}</span>
        </div>
        <motion.div
          initial={false}
          animate={{
            rotate: isExpanded ? 90 : 0,
          }}
        >
          <ChevronRightIcon
            className={cn(
              "w-4 h-4 transform transition-transform duration-200"
            )}
          />
        </motion.div>
      </motion.button>
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.ul
            initial={{
              height: 0,
            }}
            animate={{
              height: "auto",
            }}
            exit={{
              height: 0,
            }}
            className="truncate"
          >
            {route.children?.map((child, idx) => {
                return (
                  <li key={child.id}>
                    <NestedLink
                      href={child.href as string}
                      name={child.title}
                      icon={child.icon as ComponentType<IconProps>}
                      //@ts-ignore
                      isLast={idx === route.children?.length - 1}
                    />
                  </li>
                );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}

export function LinkWithoutChildren({
  route,
}: {
  route: Route;
}) {
  return (
    <PlainLink
      href={route.href as string}
      icon={route.icon as ComponentType<IconProps>}
      name={route.title}
      space={route.space}
      duplicated={route.duplicated}
    />
  );
}
