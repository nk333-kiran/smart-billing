import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Layout from "../components/dashboard/Layout";
import ProductSearch from "../components/billing/ProductSearch";
import ProductList from "../components/billing/ProductList";
import Cart from "../components/billing/Cart";
import PaymentModal from "../components/billing/PaymentModal";
import { getProducts, getCustomers, generateBill, createRazorpayOrder, verifyRazorpayPayment } from "../services/billingService";

const Billing = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showPayment, setShowPayment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedBill, setSavedBill] = useState(null);
  const navigate = useNavigate();

  const loadProducts = async () => {
    const prods = await getProducts();
    setAllProducts(prods);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [, custs] = await Promise.all([
          loadProducts(),
          getCustomers(),
        ]);
        setCustomers(custs || []);
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to load data");
      }
    };
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [search, allProducts]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error("Not enough stock");
          return prev;
        }
        return prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      if (product.stock <= 0) {
        toast.error("Out of stock");
        return prev;
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          gst: product.gst || 0,
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
  };

  const inc = (id) =>
    setCart((prev) =>
      prev.map((i) => {
        if (i.productId !== id) return i;
        if (i.quantity >= i.stock) {
          toast.error("Not enough stock");
          return i;
        }
        return { ...i, quantity: i.quantity + 1 };
      })
    );

  const dec = (id) =>
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );

  const remove = (id) =>
    setCart((prev) => prev.filter((i) => i.productId !== id));

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart]
  );

  const tax = useMemo(() => subtotal * 0.18, [subtotal]);

  const grandTotal = Math.max(0, subtotal + tax - discount);

  const cancel = () => {
    setCart([]);
    setDiscount(0);
    setCustomerId("");
  };

  const confirmPayment = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        customer: customerId || undefined,
        paymentMethod,
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          gst: i.gst,
          subtotal: i.price * i.quantity,
        })),
        subtotal,
        tax,
        discount,
        totalAmount: grandTotal,
      };

      if (paymentMethod !== "cash") {
        payload.status = "Pending";
        const bill = await generateBill(payload);
        
        const order = await createRazorpayOrder(bill._id);
        const options = {
          key: "rzp_test_TFOSfUHFHRDL9p", 
          amount: order.amount,
          currency: order.currency,
          name: "Smart Billing",
          description: "Payment for Bill",
          order_id: order.id,
          handler: async function (response) {
            setSaving(true);
            try {
              const verifyRes = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                billId: bill._id
              });
              if (verifyRes.success) {
                setSavedBill(bill);
                setShowPayment(false);
                toast.success("Payment successful & Bill generated");
                await loadProducts();
              }
            } catch (err) {
              toast.error("Payment verification failed");
            } finally {
              setSaving(false);
            }
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          toast.error("Payment failed");
          setSaving(false);
        });
        rzp.open();
      } else {
        const bill = await generateBill(payload);
        setSavedBill(bill);
        setShowPayment(false);
        toast.success("Bill generated");
        await loadProducts();
        setSaving(false);
      }
    } catch (e) {
      if (e.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (e.response) {
        toast.error(e.response.data?.message || "Failed to generate bill");
      } else {
        toast.error("Network error. Please try again.");
      }
      setSaving(false);
    }
  };

  const newBill = () => {
    setSavedBill(null);
    cancel();
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Billing (POS)</h1>

      {savedBill ? (
        <div className="bg-white p-8 rounded shadow max-w-md mx-auto text-center">
          <div className="text-green-600 text-5xl mb-3">✓</div>
          <h2 className="text-xl font-bold mb-2">
            Bill Generated Successfully
          </h2>
          <p className="text-gray-600 mb-6">
            Invoice No : {savedBill.billNumber}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/invoice/${savedBill._id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Print Invoice
            </button>
            <button
              onClick={newBill}
              className="border px-4 py-2 rounded hover:bg-gray-100"
            >
              New Bill
            </button>
          </div>
        </div>
      ) : (
        <>
          <ProductSearch 
            search={search} 
            setSearch={setSearch} 
            onScanProduct={(code) => {
              const product = allProducts.find(p => p.barcode === code);
              if (product) {
                addToCart(product);
              } else {
                toast((t) => (
                  <span className="flex items-center gap-2">
                    Product not found
                    <button 
                      onClick={() => {
                        toast.dismiss(t.id);
                        navigate("/products/add");
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Add Product
                    </button>
                  </span>
                ), { duration: 5000 });
              }
            }} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProductList products={filteredProducts} onAdd={addToCart} />
            <Cart
              items={cart}
              onInc={inc}
              onDec={dec}
              onRemove={remove}
              subtotal={subtotal}
              tax={tax}
              discount={discount}
              setDiscount={setDiscount}
              grandTotal={grandTotal}
              onCancel={cancel}
              onCheckout={() => setShowPayment(true)}
            />
          </div>
        </>
      )}

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        customers={customers}
        customerId={customerId}
        setCustomerId={setCustomerId}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        grandTotal={grandTotal}
        onConfirm={confirmPayment}
        saving={saving}
      />
    </Layout>
  );
};

export default Billing;
