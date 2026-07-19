import React from "react";

const InvoiceItems = ({ items }) => {
  return (
    <table className="w-full text-left mb-4 text-sm">
      <thead className="border-b">
        <tr>
          <th className="py-2">Item</th>
          <th className="py-2 text-center">Qty</th>
          <th className="py-2 text-right">Price</th>
          <th className="py-2 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it, idx) => (
          <tr key={idx} className="border-b">
            <td className="py-2">{it.name}</td>
            <td className="py-2 text-center">{it.quantity}</td>
            <td className="py-2 text-right">₹{it.price}</td>
            <td className="py-2 text-right">
              ₹{(it.price * it.quantity).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InvoiceItems;
