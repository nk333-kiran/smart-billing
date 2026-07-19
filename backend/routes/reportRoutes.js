const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {
  getSummary,
  getSalesReport,
  getProfitReport,
  getBestCustomers,
  getLowStock,
  getTopProducts,
} = require("../controllers/reportController");

router.get("/summary", protect, getSummary);
router.get("/sales", protect, getSalesReport);
router.get("/profit", protect, getProfitReport);
router.get("/best-customers", protect, getBestCustomers);
router.get("/low-stock", protect, getLowStock);
router.get("/top-products", protect, getTopProducts);

module.exports = router;
