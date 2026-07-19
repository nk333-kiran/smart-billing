import React from "react";
import { useNavigate } from "react-router-dom";
import { addCustomer } from "../services/customerApi";
import CustomerForm from "../components/customers/CustomerForm";

const AddCustomer = () => {
  const navigate = useNavigate();
  const handleSubmit = async (data) => {
    await addCustomer(data);
    navigate("/customers");
  };
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
      <CustomerForm onSubmit={handleSubmit} onCancel={() => navigate("/customers")} />
    </div>
  );
};

export default AddCustomer;
