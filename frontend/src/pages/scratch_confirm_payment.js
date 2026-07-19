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
