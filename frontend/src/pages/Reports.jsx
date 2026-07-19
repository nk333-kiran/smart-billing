import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Layout from "../components/dashboard/Layout";
import StatCard from "../components/dashboard/StatCard";
import {
  getSummary,
  getSalesReport,
  getProfitReport,
  getBestCustomers,
  getLowStock,
  getTopProducts,
} from "../services/reportApi";
import { exportToExcel, exportTableToPdf } from "../utils/exportUtils";

const money = (n) => `₹${(n || 0).toFixed(2)}`;

const TABS = [
  { key: "profit", label: "Profit" },
  { key: "top", label: "Top Products" },
  { key: "customers", label: "Best Customers" },
  { key: "lowstock", label: "Low Stock" },
];

const Reports = () => {
  const [summary, setSummary] = useState({});
  const [sales, setSales] = useState({ rows: [], totals: {} });
  const [profit, setProfit] = useState({ rows: [], totals: {} });
  const [topProducts, setTopProducts] = useState([]);
  const [bestCustomers, setBestCustomers] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState("week");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [payment, setPayment] = useState("");
  const [tab, setTab] = useState("profit");

  const loadSales = async () => {
    try {
      const params =
        period === "custom"
          ? { period: "custom", from, to, payment }
          : { period, payment };
      const data = await getSalesReport(params);
      setSales(data);
    } catch (e) {
      toast.error("Failed to load sales report");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [sum, prof, top, best, low] = await Promise.all([
          getSummary(),
          getProfitReport(),
          getTopProducts(),
          getBestCustomers(),
          getLowStock(),
        ]);
        setSummary(sum);
        setProfit(prof);
        setTopProducts(top);
        setBestCustomers(best);
        setLowStock(low);
        await loadSales();
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) loadSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, payment, from, to]);

  const activeExport = useMemo(() => {
    if (tab === "profit")
      return {
        name: "profit-report",
        title: "Profit Report",
        columns: [
          { key: "name", label: "Product" },
          { key: "quantity", label: "Qty" },
          { key: "revenue", label: "Revenue" },
          { key: "cost", label: "Cost" },
          { key: "profit", label: "Profit" },
        ],
        rows: profit.rows,
      };
    if (tab === "top")
      return {
        name: "top-products",
        title: "Top Products",
        columns: [
          { key: "name", label: "Product" },
          { key: "quantity", label: "Qty Sold" },
          { key: "revenue", label: "Revenue" },
        ],
        rows: topProducts,
      };
    if (tab === "customers")
      return {
        name: "best-customers",
        title: "Best Customers",
        columns: [
          { key: "name", label: "Customer" },
          { key: "phone", label: "Phone" },
          { key: "bills", label: "Bills" },
          { key: "spent", label: "Spent" },
        ],
        rows: bestCustomers,
      };
    return {
      name: "low-stock",
      title: "Low Stock",
      columns: [
        { key: "name", label: "Product" },
        { key: "stock", label: "Stock" },
        { key: "minStock", label: "Min" },
      ],
      rows: lowStock,
    };
  }, [tab, profit, topProducts, bestCustomers, lowStock]);

  const doExportExcel = () => {
    if (!activeExport.rows.length) return toast.error("Nothing to export");
    exportToExcel(activeExport.rows, activeExport.title, activeExport.name);
  };
  const doExportPdf = () => {
    if (!activeExport.rows.length) return toast.error("Nothing to export");
    exportTableToPdf(
      activeExport.title,
      activeExport.columns,
      activeExport.rows,
      activeExport.name
    );
  };

  return (
    <Layout>
          <h1 className="text-2xl font-bold mb-4">Reports &amp; Analytics</h1>

          {loading ? (
            <p>Loading…</p>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Today's Sales" value={money(summary.todaySales)} />
                <StatCard title="Total Revenue" value={money(summary.totalRevenue)} />
                <StatCard title="Total Cash" value={money(summary.totalCashPayments)} />
                <StatCard title="Total Online" value={money(summary.totalOnlinePayments)} />
                <StatCard title="Weekly Sales" value={money(summary.weeklySales)} />
                <StatCard title="Monthly Sales" value={money(summary.monthlySales)} />
                <StatCard title="Total Bills" value={summary.totalBills || 0} />
              </div>

              <div className="bg-white p-4 rounded shadow mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold flex-1">Sales Trend</h3>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="border px-3 py-2 rounded"
                  >
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">This Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  {period === "custom" && (
                    <>
                      <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border px-3 py-2 rounded"
                      />
                      <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="border px-3 py-2 rounded"
                      />
                    </>
                  )}
                  <select
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    className="border px-3 py-2 rounded"
                  >
                    <option value="">All Payments</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                  </select>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  {sales.totals?.bills || 0} bills ·{" "}
                  {money(sales.totals?.revenue)} revenue
                </p>

                {sales.rows.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">
                    No sales in this range
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={sales.rows}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="text-lg font-semibold mb-3">Top Selling Products</h3>
                {topProducts.length === 0 ? (
                  <p className="text-gray-500 py-8 text-center">No data</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantity" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white p-4 rounded shadow">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="flex gap-1 flex-1 flex-wrap">
                    {TABS.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-3 py-1 rounded ${
                          tab === t.key
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={doExportExcel}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Export Excel
                  </button>
                  <button
                    onClick={doExportPdf}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Export PDF
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        {activeExport.columns.map((c) => (
                          <th key={c.key} className="p-2">
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {activeExport.rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={activeExport.columns.length}
                            className="p-4 text-center text-gray-500"
                          >
                            No data
                          </td>
                        </tr>
                      ) : (
                        activeExport.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            {activeExport.columns.map((c) => (
                              <td key={c.key} className="p-2">
                                {["revenue", "cost", "profit", "spent"].includes(
                                  c.key
                                )
                                  ? money(row[c.key])
                                  : row[c.key] ?? "—"}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
    </Layout>
  );
};

export default Reports;
