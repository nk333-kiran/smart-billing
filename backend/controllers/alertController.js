const Product = require("../models/Product");

// Products where stock <= minStock (includes out-of-stock)
exports.getLowStock = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$stock", "$minStock"] },
    }).sort({ stock: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Products expiring within N days (default 30), not yet expired
exports.getExpiring = async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const now = new Date();
    const until = new Date();
    until.setDate(until.getDate() + days);

    const products = await Product.find({
      expiryDate: { $gte: now, $lte: until },
    }).sort({ expiryDate: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Products already past expiry
exports.getExpired = async (req, res) => {
  try {
    const products = await Product.find({
      expiryDate: { $lt: new Date() },
    }).sort({ expiryDate: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Counts for dashboard cards / navbar badge
exports.getCounts = async (req, res) => {
  try {
    const now = new Date();
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);

    const [outOfStock, lowStock, expiringSoon, expired] = await Promise.all([
      Product.countDocuments({ stock: { $lte: 0 } }),
      Product.countDocuments({
        $expr: { $lte: ["$stock", "$minStock"] },
      }),
      Product.countDocuments({ expiryDate: { $gte: now, $lte: in30 } }),
      Product.countDocuments({ expiryDate: { $lt: now } }),
    ]);

    res.json({
      outOfStock,
      lowStock,
      expiringSoon,
      expired,
      total: lowStock + expiringSoon + expired,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
