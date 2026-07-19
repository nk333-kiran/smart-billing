import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { getAlertCounts } from "../../services/alertApi";

const AlertCards = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAlertCounts();
        setCounts(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  const cards = [
    { title: "Out of Stock", value: counts.outOfStock || 0, icon: "🔴" },
    { title: "Low Stock", value: counts.lowStock || 0, icon: "🟠" },
    { title: "Expiring Soon", value: counts.expiringSoon || 0, icon: "🟡" },
    { title: "Expired", value: counts.expired || 0, icon: "⚫" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => (
        <StatCard key={i} title={c.title} value={c.value} icon={c.icon} />
      ))}
    </div>
  );
};

export default AlertCards;
