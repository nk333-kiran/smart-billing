import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
} from "../services/productApi";
import ProductTable from "../components/products/ProductTable";
import DeleteModal from "../components/products/DeleteModal";
import { toast } from "react-hot-toast";
import Layout from "../components/dashboard/Layout";
import BarcodeScanner from "../components/BarcodeScanner";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await getProducts({ search, category });
      setProducts(data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load products");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const handleEdit = (product) => {
    navigate(`/products/edit/${product._id}`);
  };

  const handleDelete = (product) => {
    setDeleteTarget(product);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-2 flex-1 min-w-[150px]">
          <input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={() => setScanning(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Scan
          </button>
        </div>
        <input
          placeholder="Category…"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-2 py-1 rounded flex-1 min-w-[150px]"
        />
        <button
          onClick={() => navigate("/products/add")}
          className="bg-blue-600 text-white px-4 py-1 rounded whitespace-nowrap"
        >
          Add Product
        </button>
      </div>
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        productName={deleteTarget?.name}
      />
      {scanning && (
        <BarcodeScanner
          onScan={(code) => {
            const exactMatch = products.find(p => p.barcode === code);
            if (exactMatch) {
              navigate(`/products/edit/${exactMatch._id}`);
            } else {
              setSearch(code);
            }
            setScanning(false);
          }}
          onCancel={() => setScanning(false)}
        />
      )}
    </Layout>
  );
};

export default Products;
