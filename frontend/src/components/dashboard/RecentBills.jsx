import React from "react";

const RecentBills = ({ bills }) => (
  <div className="overflow-x-auto mt-4">
    <h3 className="text-lg font-semibold mb-2">Recent Bills</h3>
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="border px-2 py-1">Bill #</th>
          <th className="border px-2 py-1">Customer</th>
          <th className="border px-2 py-1">Date</th>
          <th className="border px-2 py-1">Amount</th>
          <th className="border px-2 py-1">Status</th>
        </tr>
      </thead>
      <tbody>
        {bills.map((b, idx) => (
          <tr key={b._id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
            {/* Use billNumber from the backend; fallback to _id if missing */}
            <td className="border px-2 py-1">{b.billNumber || b._id}</td>
            {/* customer is populated with { _id, name } */}
            <td className="border px-2 py-1">{b.customer?.name || "-"}</td>
            {/* createdAt is a Date string; format to locale date */}
            <td className="border px-2 py-1">
              {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "-"}
            </td>
            <td className="border px-2 py-1">₹ {b.totalAmount?.toFixed(2) || "-"}</td>
            <td className="border px-2 py-1">{b.status || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RecentBills;
