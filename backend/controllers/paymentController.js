const Razorpay = require("razorpay");
const crypto = require("crypto");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");

exports.createOrder = async (req, res) => {
  try {
    const { billId } = req.body;
    if (!billId) {
      return res.status(400).json({ message: "Bill ID is required" });
    }

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (bill.totalAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay keys not configured" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(bill.totalAmount * 100), 
      currency: "INR",
      receipt: `receipt_${bill._id}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ message: "Something went wrong creating order", error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, billId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !billId) {
       return res.status(400).json({ message: "Missing required payment fields" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Razorpay secret not configured" });
    }
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    const existingPayment = await Payment.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: "Duplicate payment ID" });
    }

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    const payment = await Payment.create({
      billId,
      customerId: bill.customer,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: bill.totalAmount,
      paymentMethod: bill.paymentMethod,
      paymentStatus: "Success"
    });

    bill.status = "Paid";
    bill.paymentId = payment._id;
    bill.paymentDate = new Date();
    await bill.save();

    res.json({ success: true, message: "Payment verified successfully" });
    
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ message: "Something went wrong verifying payment", error: error.message });
  }
};
