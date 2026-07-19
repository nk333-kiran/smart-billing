const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {
  getDashboard,
  getRecentBills,
  getSalesAnalytics,
  getRevenueAnalytics,
  getTopProducts,
} = require("../controllers/dashboardController");

router.get("/", protect, getDashboard);
router.get("/recent-bills", protect, getRecentBills);
router.get("/sales", protect, getSalesAnalytics);
router.get("/revenue", protect, getRevenueAnalytics);
router.get("/top-products", protect, getTopProducts);

module.exports = router;
