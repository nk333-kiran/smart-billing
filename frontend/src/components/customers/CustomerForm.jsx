import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const CustomerForm = ({ defaultValues = {}, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const submitHandler = async (data) => {
    try {
      await onSubmit(data);
      toast.success("Customer saved");
      reset();
    } catch (e) {
      toast.error(e.response?.data?.message || "Operation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="grid grid-cols-1 gap-4">
      <div>
        <label className="block mb-1">Name *</label>
        <input
          className="w-full border px-2 py-1"
          {...register("name", { required: true })}
        />
        {errors.name && <span className="text-red-500">Required</span>}
      </div>
      <div>
        <label className="block mb-1">Phone *</label>
        <input
          className="w-full border px-2 py-1"
          {...register("phone", { required: true, pattern: /^[0-9]{10}$/ })}
        />
        {errors.phone && <span className="text-red-500">Enter 10‑digit phone</span>}
      </div>
      <div>
        <label className="block mb-1">Email</label>
        <input
          className="w-full border px-2 py-1"
          {...register("email", { pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ })}
        />
        {errors.email && <span className="text-red-500">Invalid email</span>}
      </div>
      <div>
        <label className="block mb-1">Address</label>
        <input className="w-full border px-2 py-1" {...register("address")} />
      </div>
      <div>
        <label className="block mb-1">City</label>
        <input className="w-full border px-2 py-1" {...register("city")} />
      </div>
      <div>
        <label className="block mb-1">GST Number</label>
        <input className="w-full border px-2 py-1" {...register("gstNumber")} />
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
