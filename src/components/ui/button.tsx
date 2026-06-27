import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure disabled:pointer-events-none disabled:opacity-50 cursor-pointer interactive",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-azure to-glow text-white hover:shadow-[var(--glow-blue)] hover:scale-[1.02]",
        secondary:
          "glass text-white hover:scale-[1.02] hover:border-glow/30",
        ghost:
          "border border-white/20 bg-transparent text-white hover:border-[#c9a87c]/50 hover:shadow-[0_0_20px_rgba(201,168,124,0.15)]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  magnetic?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, magnetic, href, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    if (href) {
      return (
        <a
          href={href}
          className={classes}
          data-magnetic={magnetic ? "true" : undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <button
        className={classes}
        ref={ref}
        data-magnetic={magnetic ? "true" : undefined}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
