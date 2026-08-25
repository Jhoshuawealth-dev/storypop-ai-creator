import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-fab hover:bg-primary-deep",
        deep: "bg-primary-deep text-primary-foreground hover:bg-primary-deep/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        outline: "border-2 border-border bg-card text-foreground hover:border-primary-light hover:bg-primary-soft",
        ghost: "text-primary hover:bg-primary-soft",
        soft: "bg-primary-soft text-primary hover:bg-accent",
        danger: "bg-destructive/10 text-destructive hover:bg-destructive/15",
      },
      size: {
        sm: "h-9 rounded-full px-4 text-sm",
        md: "h-11 rounded-full px-6 text-sm",
        lg: "h-[52px] rounded-full px-7 text-base",
        icon: "h-10 w-10 rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

export { buttonVariants };
