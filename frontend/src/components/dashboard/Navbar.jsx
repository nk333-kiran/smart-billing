import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { getAlertCounts } from "../../services/alertApi";

const POLL_MS = 3 * 60 * 1000; // 3 minutes

const Navbar = ({ onMenuClick }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ total: 0 });
  const prevCritical = useRef(null);
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    if (!token) return;
    let active = true;

    const poll = async () => {
      try {
        const data = await getAlertCounts();
        if (!active) return;
        setCounts(data);
        const critical = (data.outOfStock || 0) + (data.expired || 0);
        // Only toast when critical count increases (and not on first load)
        if (prevCritical.current !== null && critical > prevCritical.current) {
          toast.error(
            `${critical} critical alert${critical > 1 ? "s" : ""} (out of stock / expired)`
          );
        }
        prevCritical.current = critical;
      } catch (e) {
        // silent — don't spam on transient failures
      }
    };

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [token]);

  const total = counts.total || 0;

  return (
    <header className="flex items-center justify-between bg-white shadow p-3 md:p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-700 hover:text-gray-900 p-1"
          aria-label="Open menu"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-lg md:text-xl font-bold">Smart Billing</h1>
      </div>
      <div className="flex items-center space-x-3 md:space-x-4">
        <span className="hidden sm:block text-sm text-gray-600">{today}</span>
        <button
          onClick={() => navigate("/alerts")}
          className="relative"
          title="Alerts"
        >
          <FaBell />
          {total > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 min-w-[18px] text-center">
              {total > 99 ? "99+" : total}
            </span>
          )}
        </button>
        <div className="flex items-center space-x-1 md:space-x-2">
          <FaUserCircle />
          <span className="text-sm hidden sm:block">{user?.name || "User"}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
