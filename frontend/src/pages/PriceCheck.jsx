import React, { useState, useEffect } from "react";
import Layout from "../components/dashboard/Layout";
import BarcodeScanner from "../components/BarcodeScanner";
import { getProducts } from "../services/productApi";
import { toast } from "react-hot-toast";

const PriceCheck = () => {
  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setAllProducts).catch(() => {});
  }, []);

  const handleScan = (code) => {
    const found = allProducts.find(p => p.barcode === code);
    if (found) {
      setProduct(found);
    } else {
      toast.error("Product not found");
      setProduct(null);
    }
    setScanning(false);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Price Check</h1>
      <button
        onClick={() => setScanning(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Scan Barcode
      </button>

      {product && (
        <div className="bg-white p-6 rounded shadow max-w-sm">
          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
          <p><strong>Barcode:</strong> {product.barcode}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>GST:</strong> {product.gst}%</p>
        </div>
      )}

      {scanning && (
        <BarcodeScanner
          onScan={handleScan}
          onCancel={() => setScanning(false)}
        />
      )}
    </Layout>
  );
};

export default PriceCheck;
