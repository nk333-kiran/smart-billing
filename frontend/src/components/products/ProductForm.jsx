import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import BarcodeScanner from "../BarcodeScanner";

const ProductForm = ({ defaultValues = {}, onSubmit, onCancel }) => {
  const [scanning, setScanning] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const submitHandler = async (data) => {
    try {
      await onSubmit(data);
      toast.success("Product saved successfully");
      reset();
    } catch (e) {
      if (e.response?.data?.code === 11000 && e.response?.data?.keyPattern?.barcode) {
        toast.error("Barcode already exists");
      } else {
        toast.error(e.response?.data?.message || "Operation failed");
      }
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
        <label className="block mb-1">Category *</label>
        <input
          className="w-full border px-2 py-1"
          {...register("category", { required: true })}
        />
        {errors.category && <span className="text-red-500">Required</span>}
      </div>
      <div>
        <label className="block mb-1">Barcode</label>
        <div className="flex gap-2">
          <input className="w-full border px-2 py-1" {...register("barcode")} />
          <button
            type="button"
            onClick={() => setScanning(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Scan
          </button>
        </div>
      </div>
      {scanning && (
        <BarcodeScanner
          onScan={(code) => {
            setValue("barcode", code);
            setScanning(false);
          }}
          onCancel={() => setScanning(false)}
        />
      )}
      <div>
        <label className="block mb-1">Price *</label>
        <input
          type="number"
          className="w-full border px-2 py-1"
          {...register("price", { required: true, min: 0 })}
        />
        {errors.price && <span className="text-red-500">Invalid price</span>}
      </div>
      <div>
        <label className="block mb-1">Cost Price</label>
        <input
          type="number"
          className="w-full border px-2 py-1"
          {...register("costPrice", { min: 0 })}
        />
      </div>
      <div>
        <label className="block mb-1">Stock *</label>
        <input
          type="number"
          className="w-full border px-2 py-1"
          {...register("stock", { required: true, min: 0 })}
        />
        {errors.stock && <span className="text-red-500">Invalid stock</span>}
      </div>
      <div>
        <label className="block mb-1">Unit</label>
        <input className="w-full border px-2 py-1" {...register("unit")} />
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <textarea className="w-full border px-2 py-1" {...register("description")} />
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
