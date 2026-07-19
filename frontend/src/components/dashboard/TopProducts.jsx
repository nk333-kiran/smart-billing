import React from "react";

const TopProducts = ({ products }) => (
  <div className="mt-4">
    <h3 className="text-lg font-semibold mb-2">Top Products</h3>
    <ul className="list-disc list-inside">
      {products.map((p, i) => (
        <li key={i}>{p.name || p}</li>
      ))}
    </ul>
  </div>
);

export default TopProducts;
