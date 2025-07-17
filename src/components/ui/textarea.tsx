import * as React from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`border border-gray-300 rounded-md px-3 py-2 w-full ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
