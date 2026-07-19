const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {
  createBill,
  getBills,
  getBill,
  deleteBill,
} = require("../controllers/billController");

router.post("/", protect, createBill);
router.get("/", protect, getBills);
router.get("/:id", protect, getBill);
router.delete("/:id", protect, deleteBill);

module.exports = router;
