import React from "react";
import CartItem from "./CartItem";
import BillSummary from "./BillSummary";

const Cart = ({
  items,
  onInc,
  onDec,
  onRemove,
  subtotal,
  tax,
  discount,
  setDiscount,
  grandTotal,
  onCancel,
  onCheckout,
}) => {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Cart</h3>
      <div className="flex-1 divide-y max-h-72 overflow-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 py-2">Cart is empty</p>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onInc={onInc}
              onDec={onDec}
              onRemove={onRemove}
            />
          ))
        )}
      </div>

      <BillSummary
        subtotal={subtotal}
        tax={tax}
        discount={discount}
        setDiscount={setDiscount}
        grandTotal={grandTotal}
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 border py-2 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-40"
        >
          Generate Bill
        </button>
      </div>
    </div>
  );
};

export default Cart;
