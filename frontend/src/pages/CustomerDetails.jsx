import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomer, getCustomerHistory } from "../services/customerApi";
import { toast } from "react-hot-toast";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cust = await getCustomer(id);
        setCustomer(cust);
        const hist = await getCustomerHistory(id);
        setHistory(hist);
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to load details");
        navigate("/customers");
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!customer) return null;

  const totalBills = history.length;
  const totalPurchases = history.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const lastPurchase = history[0]?.createdAt ? new Date(history[0].createdAt).toLocaleDateString() : "-";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold mb-2">{customer.name}</h1>
      <p className="mb-1">Phone: {customer.phone}</p>
      <p className="mb-1">Email: {customer.email}</p>
      <p className="mb-1">Address: {customer.address}</p>
      <p className="mb-1">City: {customer.city}</p>
      <p className="mb-1">GST: {customer.gstNumber}</p>
      <hr className="my-4" />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Total Bills</h3>
          <p>{totalBills}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Total Purchases</h3>
          <p>₹ {totalPurchases}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Outstanding Balance</h3>
          <p>₹ {customer.outstandingBalance || 0}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Last Purchase</h3>
          <p>{lastPurchase}</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">Purchase History</h2>
      {history.length === 0 ? (
        <p>No purchases yet.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((b) => (
              <tr key={b._id}>
                <td className="border px-2 py-1">
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1">₹ {b.totalAmount}</td>
                <td className="border px-2 py-1">{b.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerDetails;
