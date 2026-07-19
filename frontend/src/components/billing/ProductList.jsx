import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, onAdd }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Products</h3>
      <div className="max-h-96 overflow-auto divide-y">
        {products.length === 0 ? (
          <p className="text-gray-500 py-2">No products found</p>
        ) : (
          products.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={onAdd} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
