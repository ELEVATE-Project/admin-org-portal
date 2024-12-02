import React from "react";
import { Info } from "lucide-react";

const OrganizationInfo = ({ orgId }) => {
  if (!orgId) {
    return null; // Or you could return a default placeholder
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Info
        className="text-gray-500 dark:text-gray-400 w-4 h-4"
        strokeWidth={2}
      />
      <span className="text-gray-600 dark:text-gray-400">Org ID: {orgId}</span>
    </div>
  );
};

export { OrganizationInfo };
