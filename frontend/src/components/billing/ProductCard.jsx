import React from "react";

const ProductCard = ({ product, onAdd }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-medium">{product.name}</p>
        <p className="text-sm text-gray-500">
          ₹{product.price} · Stock: {product.stock}
        </p>
      </div>
      <button
        onClick={() => onAdd(product)}
        disabled={product.stock <= 0}
        className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-40"
      >
        Add
      </button>
    </div>
  );
};

export default ProductCard;
