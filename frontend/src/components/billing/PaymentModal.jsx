import React from "react";

const PaymentModal = ({
  open,
  onClose,
  customers,
  customerId,
  setCustomerId,
  paymentMethod,
  setPaymentMethod,
  grandTotal,
  onConfirm,
  saving,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Customer</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">Walk-in Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} {c.phone ? `(${c.phone})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="netbanking">Net Banking</option>
          </select>
        </div>

        <div className="flex justify-between text-lg font-bold border-t pt-3 mb-4">
          <span>Grand Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-40"
          >
            {saving ? "Saving…" : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
