// src/components/ui/card.tsx
import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl border border-gray-200 shadow-md ${className}`}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`px-4 py-3 border-b border-gray-200 ${className}`}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`text-lg font-semibold leading-none tracking-tight ${className}`}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, CardSectionProps>(({ className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={`px-4 py-2 ${className}`} {...props} />
  );
});
CardContent.displayName = "CardContent";

const CardBody = React.forwardRef<HTMLDivElement, CardSectionProps>(({ className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={`p-4 space-y-4 ${className}`} {...props} />
  );
});
CardBody.displayName = "CardBody";

const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`px-4 py-3 border-t border-gray-200 text-right ${className}`}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardBody,
  CardFooter
};
