import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Layout from "../components/dashboard/Layout";
import { getStore, updateStore } from "../services/storeApi";
import { useAuth } from "../context/AuthContext";

const emptyStore = {
  storeName: "",
  ownerName: "",
  phone: "",
  address: "",
  gstNumber: "",
  invoicePrefix: "INV",
  logo: "",
  defaultTax: 18,
  invoiceFooter: "",
  printerWidth: "80mm",
};

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    {children}
  </div>
);

const Settings = () => {
  const [form, setForm] = useState(emptyStore);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStore();
        setForm({ ...emptyStore, ...data });
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await updateStore({
        ...form,
        defaultTax: Number(form.defaultTax),
      });
      setForm({ ...emptyStore, ...data });
      toast.success("Settings saved");
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Admin access required");
      } else {
        toast.error(err.response?.data?.message || "Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "border px-3 py-2 rounded w-full";

  return (
    <Layout>
          <h1 className="text-2xl font-bold mb-4">Store Settings</h1>

          {loading ? (
            <p>Loading…</p>
          ) : (
            <form
              onSubmit={save}
              className="bg-white p-6 rounded shadow max-w-2xl"
            >
              {!isAdmin && (
                <p className="mb-4 text-sm text-amber-600">
                  Only admins can change these settings. Fields are read-only.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Field label="Store Name">
                  <input
                    className={inputClass}
                    value={form.storeName}
                    onChange={set("storeName")}
                    disabled={!isAdmin}
                  />
                </Field>
                <Field label="Owner Name">
                  <input
                    className={inputClass}
                    value={form.ownerName}
                    onChange={set("ownerName")}
                    disabled={!isAdmin}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className={inputClass}
                    value={form.phone}
                    onChange={set("phone")}
                    disabled={!isAdmin}
                  />
                </Field>
                <Field label="GST Number">
                  <input
                    className={inputClass}
                    value={form.gstNumber}
                    onChange={set("gstNumber")}
                    disabled={!isAdmin}
                  />
                </Field>
                <Field label="Invoice Prefix">
                  <input
                    className={inputClass}
                    value={form.invoicePrefix}
                    onChange={set("invoicePrefix")}
                    disabled={!isAdmin}
                  />
                </Field>
                <Field label="Default Tax (%)">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={form.defaultTax}
                    onChange={set("defaultTax")}
                    disabled={!isAdmin}
                  />
                </Field>
                <Field label="Logo URL">
                  <input
                    className={inputClass}
                    value={form.logo}
                    onChange={set("logo")}
                    disabled={!isAdmin}
                    placeholder="https://…"
                  />
                </Field>
                <Field label="Printer Width">
                  <select
                    className={inputClass}
                    value={form.printerWidth}
                    onChange={set("printerWidth")}
                    disabled={!isAdmin}
                  >
                    <option value="58mm">58mm</option>
                    <option value="80mm">80mm</option>
                  </select>
                </Field>
              </div>

              <Field label="Address">
                <textarea
                  className={inputClass}
                  rows="2"
                  value={form.address}
                  onChange={set("address")}
                  disabled={!isAdmin}
                />
              </Field>
              <Field label="Invoice Footer">
                <textarea
                  className={inputClass}
                  rows="2"
                  value={form.invoiceFooter}
                  onChange={set("invoiceFooter")}
                  disabled={!isAdmin}
                />
              </Field>

              {isAdmin && (
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save Settings"}
                </button>
              )}
            </form>
          )}
    </Layout>
  );
};

export default Settings;
