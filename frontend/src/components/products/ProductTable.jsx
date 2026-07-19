import React from "react";
import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";

const ProductTable = ({ products, onEdit, onDelete }) => (
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="border px-2 py-1">Image</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Category</th>
          <th className="border px-2 py-1">Price</th>
          <th className="border px-2 py-1">Stock</th>
          <th className="border px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id} className={p.stock < 10 ? "bg-yellow-100" : ""}>
            <td className="border px-2 py-1">
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-12 w-12 object-cover" />
              ) : (
                "-"
              )}
            </td>
            <td className="border px-2 py-1">{p.name}</td>
            <td className="border px-2 py-1">{p.category}</td>
            <td className="border px-2 py-1">₹ {p.price}</td>
            <td className="border px-2 py-1">
              {p.stock}
              {p.stock < 10 && (
                <span className="ml-2 text-red-600">
                  <FaExclamationTriangle /> Low Stock
                </span>
              )}
            </td>
            <td className="border px-2 py-1 space-x-2">
              <button
                onClick={() => onEdit(p)}
                className="text-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(p)}
                className="text-red-600"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductTable;
