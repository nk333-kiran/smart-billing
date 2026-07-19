import React from "react";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white shadow rounded p-4 flex items-center">
    {icon && <div className="text-2xl mr-3">{icon}</div>}
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default StatCard;
