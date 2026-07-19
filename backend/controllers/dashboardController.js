const Bill = require("../models/Bill");
const Product = require("../models/Product");

exports.getDashboard = async (req, res) => {
  try {
    const totalSales = await Bill.countDocuments();
    const totalRevenueData = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayData = await Bill.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
    ]);

    const lowStock = await Product.find({
      $expr: { $lt: ["$stock", "$minStock"] },
    });

    res.json({
      totalSales,
      totalRevenue: totalRevenueData[0]?.total || 0,
      todayRevenue: todayData[0]?.total || 0,
      todayBills: todayData[0]?.count || 0,
      lowStock,
      lowStockCount: lowStock.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/dashboard/recent-bills
exports.getRecentBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/dashboard/sales — last 7 days, shape: [{ day, sales }]
exports.getSalesAnalytics = async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const rows = await Bill.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(rows.map((r) => ({ day: r._id, sales: r.sales, revenue: r.revenue })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/dashboard/revenue — last 7 days, shape: [{ day, revenue }]
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const rows = await Bill.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(rows.map((r) => ({ day: r._id, revenue: r.revenue })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/dashboard/top-products — by quantity sold
exports.getTopProducts = async (req, res) => {
  try {
    const rows = await Bill.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
    ]);

    res.json(rows.map((r) => ({ name: r._id, quantity: r.quantity, revenue: r.revenue })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
