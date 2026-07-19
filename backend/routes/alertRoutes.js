const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {
  getLowStock,
  getExpiring,
  getExpired,
  getCounts,
} = require("../controllers/alertController");

router.get("/counts", protect, getCounts);
router.get("/low-stock", protect, getLowStock);
router.get("/expiring", protect, getExpiring);
router.get("/expired", protect, getExpired);

module.exports = router;
