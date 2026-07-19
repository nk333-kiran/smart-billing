import React from "react";

const BillFilters = ({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  paymentFilter,
  setPaymentFilter,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <input
        placeholder="Search invoice or customer…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded flex-1 min-w-[200px]"
      />
      <select
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="all">All Dates</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="last7">Last 7 Days</option>
        <option value="month">This Month</option>
      </select>
      <select
        value={paymentFilter}
        onChange={(e) => setPaymentFilter(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="all">All Payments</option>
        <option value="cash">Cash</option>
        <option value="upi">UPI</option>
        <option value="card">Card</option>
      </select>
    </div>
  );
};

export default BillFilters;
