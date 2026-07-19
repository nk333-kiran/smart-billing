import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Layout from "../components/dashboard/Layout";
import StatCard from "../components/dashboard/StatCard";
import {
  getAlertCounts,
  getLowStock,
  getExpiring,
  getExpired,
} from "../services/alertApi";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { key: "low", label: "Low Stock" },
  { key: "expiring", label: "Expiring Soon" },
  { key: "expired", label: "Expired" },
];

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

// Returns { label, className } for the severity chip
const severity = (product, tab) => {
  if (tab === "expired") return { label: "Expired", className: "bg-gray-800 text-white" };
  if (tab === "expiring") return { label: "Expiring Soon", className: "bg-yellow-400 text-gray-900" };
  if (product.stock <= 0) return { label: "Out of Stock", className: "bg-red-600 text-white" };
  return { label: "Low Stock", className: "bg-orange-500 text-white" };
};

const Alerts = () => {
  const [counts, setCounts] = useState({});
  const [tab, setTab] = useState("low");
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [expDays, setExpDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const loadCounts = async () => {
    try {
      setCounts(await getAlertCounts());
    } catch (e) {
      // silent
    }
  };

  const loadTab = async () => {
    setLoading(true);
    try {
      let data;
      if (tab === "low") data = await getLowStock();
      else if (tab === "expiring") data = await getExpiring(expDays);
      else data = await getExpired();
      setRows(data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  useEffect(() => {
    loadTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, expDays]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  return (
    <Layout>
          <h1 className="text-2xl font-bold mb-4">Alerts</h1>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Out of Stock" value={counts.outOfStock || 0} icon="🔴" />
            <StatCard title="Low Stock" value={counts.lowStock || 0} icon="🟠" />
            <StatCard title="Expiring Soon" value={counts.expiringSoon || 0} icon="🟡" />
            <StatCard title="Expired" value={counts.expired || 0} icon="⚫" />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex gap-1 flex-1 flex-wrap">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-3 py-1 rounded ${
                      tab === t.key ? "bg-blue-600 text-white" : "bg-gray-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {tab === "expiring" && (
                <select
                  value={expDays}
                  onChange={(e) => setExpDays(Number(e.target.value))}
                  className="border px-3 py-1 rounded"
                >
                  <option value={7}>Next 7 days</option>
                  <option value={15}>Next 15 days</option>
                  <option value={30}>Next 30 days</option>
                </select>
              )}
              <input
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-1 rounded"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Product</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2">Min</th>
                    <th className="p-2">Expiry</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500">
                        Loading…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500">
                        No alerts here — all good.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => {
                      const s = severity(p, tab);
                      return (
                        <tr key={p._id} className="hover:bg-gray-50">
                          <td className="p-2 font-medium">{p.name}</td>
                          <td className="p-2">{p.category || "—"}</td>
                          <td className="p-2">{p.stock}</td>
                          <td className="p-2">{p.minStock}</td>
                          <td className="p-2">{fmtDate(p.expiryDate)}</td>
                          <td className="p-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${s.className}`}
                            >
                              {s.label}
                            </span>
                          </td>
                          <td className="p-2">
                            {isAdmin ? (
                              <button
                                onClick={() => navigate(`/products/edit/${p._id}`)}
                                className="text-blue-600 hover:underline"
                              >
                                Edit / Update Stock
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                View only
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
    </Layout>
  );
};

export default Alerts;
