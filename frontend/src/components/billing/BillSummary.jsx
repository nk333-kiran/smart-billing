import React from "react";

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between py-1 ${bold ? "font-bold text-lg" : ""}`}>
    <span>{label}</span>
    <span>₹{value.toFixed(2)}</span>
  </div>
);

const BillSummary = ({ subtotal, tax, discount, setDiscount, grandTotal }) => {
  return (
    <div className="border-t pt-3 mt-3">
      <Row label="Subtotal" value={subtotal} />
      <Row label="GST (18%)" value={tax} />
      <div className="flex justify-between items-center py-1">
        <span>Discount</span>
        <div className="flex items-center gap-1">
          <span>₹</span>
          <input
            type="number"
            min="0"
            value={discount}
            onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
            className="border px-2 py-1 rounded w-24 text-right"
          />
        </div>
      </div>
      <div className="border-t mt-2 pt-2">
        <Row label="Grand Total" value={grandTotal} bold />
      </div>
    </div>
  );
};

export default BillSummary;
