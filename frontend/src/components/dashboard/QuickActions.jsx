import React from "react";
import { FaPlus, FaFileInvoice, FaUserPlus, FaChartBar, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const actions = [
  { label: "Add Product", icon: <FaPlus />, path: "/products/add" },
  { label: "Create Bill", icon: <FaFileInvoice />, path: "/bills/create" },
  { label: "Add Customer", icon: <FaUserPlus />, path: "/customers/add" },
  { label: "Reports", icon: <FaChartBar />, path: "/reports" },
  { label: "Quick Scan", icon: <FaSearch />, path: "/price-check" },
];

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={() => navigate(a.path)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded"
          >
            {a.icon}
            <span>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
