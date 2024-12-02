import React from "react";

const InfoCard = ({ icon: Icon, label, value, className = "" }) => {
  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      {Icon && <Icon className="h-5 w-5 text-gray-400 mt-0.5" />}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="mt-1 text-sm text-gray-900">{value}</div>
      </div>
    </div>
  );
};

export default InfoCard;
