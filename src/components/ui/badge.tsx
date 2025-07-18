import * as React from "react";
import { cn } from "../../lib/utils"; 
// Define the base classes that apply to all badges
const baseBadgeClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

// Define an object to map variants to their specific Tailwind classes
const variantClasses = {
  default:
    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground border-input", // Added border-input for better visibility
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  // Define the 'variant' prop directly
  variant?: keyof typeof variantClasses; // Ensures variant is one of the keys in variantClasses
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  // Determine the specific variant classes
  const specificVariantClasses = variantClasses[variant];

  return (
    <div
      className={cn(baseBadgeClasses, specificVariantClasses, className)}
      {...props}
    />
  );
}

export { Badge };
