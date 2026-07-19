const router = require("express").Router();
const {
  getCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerHistory,
} = require("../controllers/customerController");

router.get("/", getCustomers);
router.get("/history/:id", getCustomerHistory); // optional separate endpoint
router.get("/:id", getCustomer);
router.post("/", addCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
