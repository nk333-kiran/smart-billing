const Bill = require("../models/Bill");
const Product = require("../models/Product");

const rangeStart = (period) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (period === "today") return d;
  if (period === "week") {
    d.setDate(d.getDate() - 6);
    return d;
  }
  if (period === "month") {
    d.setDate(1);
    return d;
  }
  return null;
};

// GET /api/reports/summary — cards
exports.getSummary = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);
    const monthStart = new Date(today);
    monthStart.setDate(1);

    const sumBetween = async (start) => {
      const rows = await Bill.aggregate([
        { $match: { 
            ...(start ? { createdAt: { $gte: start } } : {}),
            status: { $ne: "Pending" } 
        } },
        { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      ]);
      return { total: rows[0]?.total || 0, count: rows[0]?.count || 0 };
    };

    const paymentMethodsStats = await Bill.aggregate([
      { $match: { status: { $ne: "Pending" } } },
      { $group: { _id: "$paymentMethod", total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
    ]);

    let totalCashPayments = 0;
    let totalOnlinePayments = 0;
    const revenueByMethod = {};

    paymentMethodsStats.forEach(stat => {
      const method = stat._id || 'unknown';
      revenueByMethod[method] = stat.total;
      if (method === 'cash') {
        totalCashPayments += stat.total;
      } else {
        totalOnlinePayments += stat.total;
      }
    });

    const [todayAgg, weekAgg, monthAgg, allAgg] = await Promise.all([
      sumBetween(today),
      sumBetween(weekStart),
      sumBetween(monthStart),
      sumBetween(null),
    ]);

    res.json({
      todaySales: todayAgg.total,
      weeklySales: weekAgg.total,
      monthlySales: monthAgg.total,
      totalRevenue: allAgg.total,
      totalBills: allAgg.count,
      totalCashPayments,
      totalOnlinePayments,
      revenueByMethod
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reports/sales?from=&to=&payment=  — grouped by day
exports.getSalesReport = async (req, res) => {
  try {
    const { from, to, payment, period } = req.query;
    const match = {};

    if (period && period !== "custom") {
      const start = rangeStart(period);
      if (start) match.createdAt = { $gte: start };
    } else if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        match.createdAt.$lte = end;
      }
    }
    if (payment) match.paymentMethod = payment;

    const rows = await Bill.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          bills: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
          tax: { $sum: "$tax" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totals = rows.reduce(
      (acc, r) => {
        acc.bills += r.bills;
        acc.revenue += r.revenue;
        return acc;
      },
      { bills: 0, revenue: 0 }
    );

    res.json({
      rows: rows.map((r) => ({
        day: r._id,
        bills: r.bills,
        revenue: r.revenue,
        tax: r.tax,
      })),
      totals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reports/profit — profit = sum((price - costPrice) * qty)
exports.getProfitReport = async (req, res) => {
  try {
    const rows = await Bill.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $addFields: {
          cost: { $ifNull: [{ $arrayElemAt: ["$product.costPrice", 0] }, 0] },
        },
      },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.subtotal" },
          cost: { $sum: { $multiply: ["$cost", "$items.quantity"] } },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          quantity: 1,
          revenue: 1,
          cost: 1,
          profit: { $subtract: ["$revenue", "$cost"] },
        },
      },
      { $sort: { profit: -1 } },
    ]);

    const totals = rows.reduce(
      (acc, r) => {
        acc.revenue += r.revenue;
        acc.cost += r.cost;
        acc.profit += r.profit;
        return acc;
      },
      { revenue: 0, cost: 0, profit: 0 }
    );

    res.json({ rows, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reports/best-customers
exports.getBestCustomers = async (req, res) => {
  try {
    const rows = await Bill.aggregate([
      { $match: { customer: { $ne: null } } },
      {
        $group: {
          _id: "$customer",
          bills: { $sum: 1 },
          spent: { $sum: "$totalAmount" },
        },
      },
      { $sort: { spent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $project: {
          _id: 0,
          name: { $ifNull: [{ $arrayElemAt: ["$customer.name", 0] }, "Unknown"] },
          phone: { $arrayElemAt: ["$customer.phone", 0] },
          bills: 1,
          spent: 1,
        },
      },
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reports/low-stock
exports.getLowStock = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lt: ["$stock", "$minStock"] },
    }).sort({ stock: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reports/top-products
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
      { $limit: 10 },
      { $project: { _id: 0, name: "$_id", quantity: 1, revenue: 1 } },
    ]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
