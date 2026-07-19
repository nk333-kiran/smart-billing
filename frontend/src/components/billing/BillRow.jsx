import React from "react";
import { FaEye, FaPrint, FaTrash } from "react-icons/fa";

const BillRow = ({ bill, onView, onPrint, onDelete, canDelete }) => {
  return (
    <tr className="hover:bg-gray-50 border-b">
      <td className="p-3 font-medium">{bill.billNumber}</td>
      <td className="p-3">{bill.customer?.name || "Walk-in"}</td>
      <td className="p-3">{bill.items?.length || 0}</td>
      <td className="p-3">₹{(bill.totalAmount || 0).toFixed(2)}</td>
      <td className="p-3 capitalize">{bill.paymentMethod}</td>
      <td className="p-3">{new Date(bill.createdAt).toLocaleDateString()}</td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onView(bill)}
            className="text-blue-600 hover:text-blue-800"
            title="View"
          >
            <FaEye />
          </button>
          <button
            onClick={() => onPrint(bill)}
            className="text-gray-600 hover:text-gray-800"
            title="Print"
          >
            <FaPrint />
          </button>
          {canDelete && (
            <button
              onClick={() => onDelete(bill)}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default BillRow;
