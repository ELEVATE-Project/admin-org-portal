// @/components/ui/badge.jsx
import * as React from "react";

const Badge = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-primary-100 text-primary-900",
      secondary: "bg-gray-100 text-gray-900",
      destructive: "bg-red-100 text-red-900",
      success: "bg-green-100 text-green-900",
      warning: "bg-yellow-100 text-yellow-900",
      outline: "border border-gray-200 text-gray-900",
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
