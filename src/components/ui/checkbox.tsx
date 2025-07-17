// src/components/ui/checkbox.tsx
import * as React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", ...props }, ref) => {
    return (
      
      <input
        type="checkbox"
        ref={ref}
        className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`}
        {...props}
        
      />
      
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
