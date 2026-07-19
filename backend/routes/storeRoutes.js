const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const { getStore, updateStore } = require("../controllers/storeController");

router.get("/", protect, getStore);
router.put("/", protect, updateStore);

module.exports = router;
