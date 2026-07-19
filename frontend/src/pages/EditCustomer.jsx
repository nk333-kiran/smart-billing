import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomer, updateCustomer } from "../services/customerApi";
import CustomerForm from "../components/customers/CustomerForm";
import { toast } from "react-hot-toast";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCustomer(id);
        setDefaultValues(data);
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to load customer");
        navigate("/customers");
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (data) => {
    await updateCustomer(id, data);
    navigate("/customers");
  };

  if (!defaultValues) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
      <CustomerForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/customers")}
      />
    </div>
  );
};

export default EditCustomer;
