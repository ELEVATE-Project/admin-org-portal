import React from "react";

const Alert = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-gray-900",
      destructive: "bg-red-50 text-red-900 border-red-500",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={`
          rounded-lg border p-4 absolute bottom-4 right-4 w-fit h-fit z-[999]
          ${variants[variant]}
          ${className}
        `}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
