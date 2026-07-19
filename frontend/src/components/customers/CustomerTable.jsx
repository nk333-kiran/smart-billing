import React from "react";
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CustomerTable = ({ customers, onEdit, onDelete }) => (
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Phone</th>
          <th className="border px-2 py-1">Email</th>
          <th className="border px-2 py-1">Balance</th>
          <th className="border px-2 py-1">Status</th>
          <th className="border px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c._id}>
            <td className="border px-2 py-1">{c.name}</td>
            <td className="border px-2 py-1">{c.phone}</td>
            <td className="border px-2 py-1">{c.email}</td>
            <td className="border px-2 py-1">₹ {c.outstandingBalance || 0}</td>
            <td className="border px-2 py-1">
              {c.status === "Active" ? (
                <span className="text-green-600 flex items-center">
                  <FaCheckCircle className="mr-1" /> Active
                </span>
              ) : (
                <span className="text-gray-600 flex items-center">
                  <FaTimesCircle className="mr-1" /> Inactive
                </span>
              )}
            </td>
            <td className="border px-2 py-1 space-x-2">
              <button onClick={() => onEdit(c)} className="text-blue-600">
                <FaEdit />
              </button>
              <button onClick={() => onDelete(c)} className="text-red-600">
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CustomerTable;
