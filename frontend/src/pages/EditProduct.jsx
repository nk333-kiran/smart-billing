import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, updateProduct } from "../services/productApi";
import ProductForm from "../components/products/ProductForm";
import { toast } from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProduct(id);
        setDefaultValues(data);
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to load product");
        navigate("/products");
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (data) => {
    await updateProduct(id, data);
    navigate("/products");
  };

  if (!defaultValues) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/products")}
      />
    </div>
  );
};

export default EditProduct;
