const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const Product = require("./models/Product");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const billRoutes = require("./routes/billRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const customerRoutes = require("./routes/customerRoutes");
const storeRoutes = require("./routes/storeRoutes");
const reportRoutes = require("./routes/reportRoutes");
const alertRoutes = require("./routes/alertRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();
connectDB();

const app = express();

// CORS configuration for production.
// Only allow requests from the local development server and the Vercel frontend.
const allowedOrigins = [
  "http://localhost:5173",
  "https://smart-billing-ivory.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non‑browser requests (e.g., curl, Postman) which have no origin.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SmartBill API Running" });
});

app.get("/test-product", async (req, res) => {
  try {
    const product = await Product.create({
      name: "Milk",
      barcode: Date.now().toString(),
      price: 30,
      stock: 50
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});