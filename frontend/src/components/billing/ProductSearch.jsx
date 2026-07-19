import React, { useState } from "react";
import BarcodeScanner from "../BarcodeScanner";

const ProductSearch = ({ search, setSearch, onScanProduct }) => {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Search Product</label>
      <div className="flex gap-2">
        <input
          placeholder="Type to search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
        <button
          onClick={() => setScanning(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Scan
        </button>
      </div>
      {scanning && (
        <BarcodeScanner
          onScan={(code) => {
            if (onScanProduct) {
              onScanProduct(code);
            } else {
              setSearch(code);
            }
            setScanning(false);
          }}
          onCancel={() => setScanning(false)}
        />
      )}
    </div>
  );
};

export default ProductSearch;
