import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCustomers,
  deleteCustomer,
} from "../services/customerApi";
import CustomerTable from "../components/customers/CustomerTable";
import DeleteCustomerModal from "../components/customers/DeleteCustomerModal";
import Pagination from "../components/customers/Pagination";
import { toast } from "react-hot-toast";
import Layout from "../components/dashboard/Layout";

const Customers = () => {
  const [data, setData] = useState({ customers: [], total: 0, page: 1, limit: 10 });
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const fetch = async (page = data.page) => {
    try {
      const res = await getCustomers({ search, page, limit: data.limit });
      setData({ ...res, limit: data.limit });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load customers");
    }
  };

  useEffect(() => {
    fetch(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleEdit = (customer) => {
    navigate(`/customers/edit/${customer._id}`);
  };

  const handleDelete = (customer) => {
    setDeleteTarget(customer);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomer(deleteTarget._id);
      setData((prev) => ({
        ...prev,
        customers: prev.customers.filter((c) => c._id !== deleteTarget._id),
        total: prev.total - 1,
      }));
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  const changePage = (p) => {
    fetch(p);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded flex-1 min-w-[150px]"
        />
        <button
          onClick={() => navigate("/customers/add")}
          className="bg-blue-600 text-white px-4 py-1 rounded whitespace-nowrap"
        >
          Add Customer
        </button>
      </div>
      <CustomerTable
        customers={data.customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Pagination
        page={data.page}
        total={data.total}
        limit={data.limit}
        onPageChange={changePage}
      />
      <DeleteCustomerModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        customerName={deleteTarget?.name}
      />
    </Layout>
  );
};

export default Customers;
