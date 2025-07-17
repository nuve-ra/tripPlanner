// src/components/ui/form.tsx
import * as React from "react";

export function Form({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form {...props}>{children}</form>;
}

export const FormItem = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 ${className}`} {...props} />
);

export const FormLabel = ({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={`block text-sm font-medium mb-1 ${className}`} {...props} />
);

export const FormControl = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`w-full ${className}`} {...props} />
);

export const FormMessage = ({ className = "", children }: { className?: string; children?: React.ReactNode }) => (
  <p className={`text-sm text-red-500 mt-1 ${className}`}>{children}</p>
);
export const FormField=({ className="", children}: { className?: string; children?: React.ReactNode })=>(
  <p className={`text-sm text-red-500 mt-1 ${className}`}>{children}</p>
);