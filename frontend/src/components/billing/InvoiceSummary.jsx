import React from "react";

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between py-1 ${bold ? "font-bold text-lg" : ""}`}>
    <span>{label}</span>
    <span>₹{(value || 0).toFixed(2)}</span>
  </div>
);

const InvoiceSummary = ({ bill }) => {
  return (
    <div className="flex justify-between items-start mt-6">
      <div className="w-1/2 text-sm text-gray-600">
        <h4 className="font-bold text-gray-800 mb-2">Payment Info</h4>
        <div><span className="font-semibold">Status:</span> {bill.status || "Paid"}</div>
        <div><span className="font-semibold">Method:</span> {bill.paymentMethod?.toUpperCase()}</div>
        {bill.paymentId && (
          <>
            <div><span className="font-semibold">Payment ID:</span> {bill.paymentId.razorpayPaymentId}</div>
            <div><span className="font-semibold">Order ID:</span> {bill.paymentId.razorpayOrderId}</div>
            <div><span className="font-semibold">Date:</span> {new Date(bill.paymentDate || bill.createdAt).toLocaleString()}</div>
          </>
        )}
      </div>
      <div className="w-64 text-sm">
        <Row label="Subtotal" value={bill.subtotal} />
        <Row label="GST" value={bill.tax} />
        <Row label="Discount" value={bill.discount} />
        <div className="border-t mt-2 pt-2">
          <Row label="Grand Total" value={bill.totalAmount} bold />
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
