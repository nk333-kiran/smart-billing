import React from "react";
import BillRow from "./BillRow";

const BillTable = ({ bills, onView, onPrint, onDelete, canDelete }) => {
  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Invoice No</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Items</th>
            <th className="p-3">Total</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b) => (
            <BillRow
              key={b._id}
              bill={b}
              onView={onView}
              onPrint={onPrint}
              onDelete={onDelete}
              canDelete={canDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillTable;
