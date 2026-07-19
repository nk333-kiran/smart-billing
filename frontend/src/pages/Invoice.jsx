import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getBill } from "../services/billingService";
import { getStore } from "../services/storeApi";
import { store as storeFallback } from "../config/storeConfig";
import InvoiceHeader from "../components/billing/InvoiceHeader";
import InvoiceItems from "../components/billing/InvoiceItems";
import InvoiceSummary from "../components/billing/InvoiceSummary";
import InvoiceFooter from "../components/billing/InvoiceFooter";

const Invoice = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [store, setStore] = useState(storeFallback);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const invoiceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [data, storeData] = await Promise.all([
          getBill(id),
          getStore().catch(() => null),
        ]);
        setBill(data);
        if (storeData) {
          setStore({
            name: storeData.storeName || storeFallback.name,
            address: storeData.address || storeFallback.address,
            gstin: storeData.gstNumber || storeFallback.gstin,
            phone: storeData.phone || storeFallback.phone,
            logo: storeData.logo || "",
            invoiceFooter: storeData.invoiceFooter || "",
          });
        }
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const downloadPdf = async () => {
    if (!invoiceRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      pdf.save(`${bill.billNumber}.pdf`);
    } catch (e) {
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!bill) return <div className="p-6">Invoice not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between mb-4 no-print">
          <button
            onClick={() => navigate("/bills")}
            className="border px-4 py-2 rounded bg-white hover:bg-gray-50"
          >
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Print Invoice
            </button>
            <button
              onClick={downloadPdf}
              disabled={downloading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-40"
            >
              {downloading ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>

        <div
          ref={invoiceRef}
          id="invoice"
          className="bg-white p-8 rounded shadow print:shadow-none print:rounded-none"
        >
          <InvoiceHeader store={store} bill={bill} />
          <InvoiceItems items={bill.items} />
          <InvoiceSummary bill={bill} />
          <InvoiceFooter bill={bill} message={store.invoiceFooter} />
        </div>
      </div>
    </div>
  );
};

export default Invoice;
