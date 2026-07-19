import React, { useEffect, useState } from "react";
import Layout from "../components/dashboard/Layout";
import DashboardCards from "../components/dashboard/DashboardCards";
import AlertCards from "../components/dashboard/AlertCards";
import SalesChart from "../components/dashboard/SalesChart";
import RevenueChart from "../components/dashboard/RevenueChart";
import RecentBills from "../components/dashboard/RecentBills";
import TopProducts from "../components/dashboard/TopProducts";
import QuickActions from "../components/dashboard/QuickActions";
import {
  getDashboardSummary,
  getRecentBills,
  getSalesAnalytics,
  getRevenueAnalytics,
  getTopProducts,
} from "../services/dashboardApi";

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [bills, setBills] = useState([]);
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sum, recent, salesData, revData, top] = await Promise.all([
          getDashboardSummary(),
          getRecentBills(),
          getSalesAnalytics(),
          getRevenueAnalytics(),
          getTopProducts(),
        ]);
        setSummary(sum);
        setBills(recent);
        setSales(salesData);
        setRevenue(revData);
        setTopProducts(top);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <Layout>
      <DashboardCards summary={summary} />
      <AlertCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Sales Chart</h3>
          <SalesChart data={sales} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Revenue Chart</h3>
          <RevenueChart data={revenue} />
        </div>
      </div>
      <RecentBills bills={bills} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <TopProducts products={topProducts} />
        <QuickActions />
      </div>
    </Layout>
  );
};

export default Dashboard;
