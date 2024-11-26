import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        activo:
          "border-transparent bg-green text-green-foreground shadow hover:bg-green/75",
        inactivo:
          "border-transparent bg-red text-red-foreground shadow hover:bg-red/75",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline:
          "text-foreground",
        completado:
          "border-transparent bg-completed text-completed-foreground shadow hover:bg-completed/75",
        pendiente:
          "border-transparent bg-pending text-pending-foreground shadow hover:bg-pending/75",
        proceso:
          "border-transparent bg-process text-process-foreground shadow hover:bg-process/75",
        cancelado:
          "border-transparent bg-cancelled text-cancelled-foreground shadow hover:bg-cancelled/75",
        bot:
          "border-transparent bg-bot text-bot-foreground shadow hover:bg-bot/75",
        precaucion:
          "border-transparent bg-precaucion text-precaucion-foreground shadow hover:bg-precaucion/75",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className )} {...props} />
  );
}

export { Badge, badgeVariants };
