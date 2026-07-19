const Store = require("../models/Store");

// GET /api/store — returns the singleton store, creating a default if none exists
exports.getStore = async (req, res) => {
  try {
    let store = await Store.findOne();
    if (!store) {
      store = await Store.create({ storeName: "My Store" });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/store — admin only
exports.updateStore = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    let store = await Store.findOne();
    if (!store) {
      store = await Store.create(req.body);
    } else {
      Object.assign(store, req.body);
      await store.save();
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
