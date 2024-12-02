import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className="relative w-full" ref={ref} {...props}>
    {children}
  </div>
));
Select.displayName = "Select";

const SelectTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={`
      flex h-10 w-full items-center justify-between rounded-md border border-gray-200 
      bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 
      disabled:cursor-not-allowed disabled:opacity-50 ${className}
    `}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
);
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`
      absolute top-full mt-1 w-full rounded-md border border-gray-200 bg-white 
      py-1 shadow-lg z-50 ${className}
    `}
      {...props}
    >
      {children}
    </div>
  )
);
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={`
      relative flex w-full cursor-pointer select-none items-center py-1.5 px-3 
      text-sm outline-none hover:bg-gray-50 focus:bg-gray-100 ${className}
    `}
      {...props}
    >
      <span className="flex-1">{children}</span>
      <Check className="h-4 w-4 opacity-0 transition-opacity data-[selected]:opacity-100" />
    </button>
  )
);
SelectItem.displayName = "SelectItem";

const SelectValue = React.forwardRef(({ className, ...props }, ref) => (
  <span ref={ref} className={`block truncate ${className}`} {...props} />
));
SelectValue.displayName = "SelectValue";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
