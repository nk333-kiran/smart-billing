import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaUsers, FaFileInvoice, FaShoppingCart, FaChartBar, FaCog, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const menu = [
  { name: "Dashboard", icon: <FaTachometerAlt />, to: "/dashboard" },
  { name: "Products", icon: <FaBox />, to: "/products" },
  { name: "Customers", icon: <FaUsers />, to: "/customers" },
  { name: "Billing", icon: <FaShoppingCart />, to: "/billing" },
  { name: "Bills", icon: <FaFileInvoice />, to: "/bills" },
  { name: "Reports", icon: <FaChartBar />, to: "/reports" },
  { name: "Settings", icon: <FaCog />, to: "/settings" },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 flex flex-col z-30
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:flex lg:z-auto
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">SmartBill</h2>
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:text-gray-300 p-1"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {menu.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center p-2 rounded hover:bg-gray-700 mt-4"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
