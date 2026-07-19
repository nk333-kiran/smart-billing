import React from "react";
import { FaTrash } from "react-icons/fa";

const CartItem = ({ item, onInc, onDec, onRemove }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-500">
          {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDec(item.productId)}
          className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300"
        >
          -
        </button>
        <span className="w-6 text-center">{item.quantity}</span>
        <button
          onClick={() => onInc(item.productId)}
          className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300"
        >
          +
        </button>
        <button
          onClick={() => onRemove(item.productId)}
          className="ml-2 text-red-600 hover:text-red-800"
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
