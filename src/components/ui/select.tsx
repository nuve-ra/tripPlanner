import * as React from "react";

interface SelectContextType {
  value: string;
  onChange: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

export interface SelectRootProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

function Select({ value, onValueChange, children }: SelectRootProps) {
  return (
    <SelectContext.Provider value={{ value, onChange: onValueChange }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger must be used within Select");

    return (
      <button
        ref={ref}
        className={`w-full border border-gray-300 rounded px-3 py-2 text-left bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      >
        {context.value || <span className="text-gray-400">Select an option</span>}
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = () => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");

  return <span>{context.value}</span>;
};
SelectValue.displayName = "SelectValue";

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow">
      {children}
    </div>
  );
};
SelectContent.displayName = "SelectContent";

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");

  return (
    <div
      onClick={() => context.onChange(value)}
      className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
        context.value === value ? "bg-blue-200 font-medium" : ""
      }`}
    >
      {children}
    </div>
  );
};
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};
