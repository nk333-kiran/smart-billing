import React from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../services/productApi";
import ProductForm from "../components/products/ProductForm";

const AddProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await addProduct(data);
    navigate("/products");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <ProductForm onSubmit={handleSubmit} onCancel={() => navigate("/products")} />
    </div>
  );
};

export default AddProduct;
