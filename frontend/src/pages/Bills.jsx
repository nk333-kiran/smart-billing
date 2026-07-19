import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Layout from "../components/dashboard/Layout";
import BillFilters from "../components/billing/BillFilters";
import BillTable from "../components/billing/BillTable";
import DeleteBillModal from "../components/billing/DeleteBillModal";
import { getBills, deleteBill } from "../services/billingService";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 10;

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const matchesDate = (created, filter) => {
  if (filter === "all") return true;
  const now = new Date();
  const c = new Date(created);
  const today = startOfDay(now);
  if (filter === "today") return c >= today;
  if (filter === "yesterday") {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    return c >= y && c < today;
  }
  if (filter === "last7") {
    const week = new Date(today);
    week.setDate(week.getDate() - 6);
    return c >= week;
  }
  if (filter === "month") {
    return (
      c.getMonth() === now.getMonth() && c.getFullYear() === now.getFullYear()
    );
  }
  return true;
};

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const loadBills = async () => {
    try {
      const data = await getBills();
      setBills(data);
    } catch (e) {
      if (e.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(e.response?.data?.message || "Failed to load bills");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bills.filter((b) => {
      const matchSearch =
        !q ||
        b.billNumber?.toLowerCase().includes(q) ||
        b.customer?.name?.toLowerCase().includes(q);
      const matchPayment =
        paymentFilter === "all" || b.paymentMethod === paymentFilter;
      const matchDate = matchesDate(b.createdAt, dateFilter);
      return matchSearch && matchPayment && matchDate;
    });
  }, [bills, search, paymentFilter, dateFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, paymentFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageBills = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const view = (bill) => navigate(`/invoice/${bill._id}`);
  const print = (bill) => navigate(`/invoice/${bill._id}`);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBill(deleteTarget._id);
      setBills((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      toast.success("Bill deleted");
    } catch (e) {
      if (e.response?.status === 403) {
        toast.error("Admin access required");
      } else {
        toast.error(e.response?.data?.message || "Delete failed");
      }
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Bill History</h1>
        <button
          onClick={() => navigate("/billing")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Bill
        </button>
      </div>

      <BillFilters
        search={search}
        setSearch={setSearch}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
      />

      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded shadow p-12 text-center">
          <p className="text-lg font-semibold mb-1">No Bills Found</p>
          <p className="text-gray-500">Generate your first bill.</p>
        </div>
      ) : (
        <>
          <BillTable
            bills={pageBills}
            onView={view}
            onPrint={print}
            onDelete={setDeleteTarget}
            canDelete={isAdmin}
          />

          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`px-3 py-1 border rounded ${
                    n === page ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {n}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}

      <DeleteBillModal
        open={!!deleteTarget}
        bill={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </Layout>
  );
};

export default Bills;
