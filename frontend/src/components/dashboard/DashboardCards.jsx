import React from "react";
import { FaBoxOpen, FaUsers, FaFileInvoiceDollar, FaChartLine } from "react-icons/fa";
import StatCard from "./StatCard";

const DashboardCards = ({ summary }) => {
  const cards = [
    { title: "Total Products", value: summary.totalProducts, icon: <FaBoxOpen /> },
    { title: "Total Customers", value: summary.totalCustomers, icon: <FaUsers /> },
    { title: "Total Bills", value: summary.totalBills, icon: <FaFileInvoiceDollar /> },
    { title: "Today's Sales", value: `₹ ${summary.todaySales}`, icon: <FaChartLine /> },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <StatCard key={i} title={c.title} value={c.value} icon={c.icon} />
      ))}
    </div>
  );
};

export default DashboardCards;
