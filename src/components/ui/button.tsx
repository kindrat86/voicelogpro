import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary-foreground/20",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-2 border-destructive-foreground/20",
        outline: "border-2 border-border bg-transparent text-foreground hover:bg-secondary hover:border-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2 border-border",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom CTA button - bold, industrial, stamped
        cta: "bg-primary text-primary-foreground font-display text-lg uppercase tracking-wider border-2 border-primary-foreground/20 shadow-[3px_3px_0_0_hsl(220_10%_5%)] hover:shadow-[1px_1px_0_0_hsl(220_10%_5%)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
        // Hero variant - larger, more prominent, stamped
        hero: "bg-primary text-primary-foreground font-display text-xl md:text-2xl uppercase tracking-wider py-4 px-8 border-2 border-primary-foreground/20 shadow-[4px_4px_0_0_hsl(220_10%_5%)] hover:shadow-[2px_2px_0_0_hsl(220_10%_5%)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none",
        // Jobsite variant - large tactile targets for glove use
        jobsite: "bg-primary text-primary-foreground font-display text-lg uppercase tracking-wider border-2 border-primary-foreground/20 shadow-[4px_4px_0_0_hsl(220_10%_5%)] active:shadow-none active:translate-y-1 transition-all duration-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
        // Jobsite size - minimum 60px for glove-friendly tap targets
        jobsite: "h-16 min-h-[60px] px-8 text-lg [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
