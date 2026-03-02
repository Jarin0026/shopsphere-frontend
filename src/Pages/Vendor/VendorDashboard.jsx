import { useState, useEffect } from "react";
import api from "../../services/Api.js";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function VendorDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    fetchAnalytics();
    fetchMonthlyRevenue(); // ✅ Call it here
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/vendor/analytics");
      setAnalytics(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load analytics.");
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const res = await api.get("/vendor/monthly-revenue");

      const formatted = Object.entries(res.data)
        .sort((a, b) => new Date(a[0]) - new Date(b[0])) // sort by date
        .map(([yearMonth, amount]) => {
          const date = new Date(yearMonth + "-01"); // convert 2026-02 → date
          const month = date.toLocaleString("default", { month: "short" });

          return {
            month,
            amount,
          };
        });

      setMonthlyRevenue(formatted);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load monthly revenue.",
      );
    }
  };

  if (!analytics) return <h2>Loading...</h2>;

  const statusData = Object.entries(analytics.statusBreakdown).map(
    ([status, count]) => ({
      name: status,
      value: count,
    }),
  );

  const COLORS = ["#000000", "#8884d8", "#82ca9d", "#ff7300"];

  return (
    <div className="space-y-12">
      {/* ================= Header ================= */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Vendor Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Overview of your store performance and revenue insights.
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Revenue
          </p>
          <p className="text-3xl font-bold mt-3">₹ {analytics.totalRevenue}</p>
        </div>

        <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Orders
          </p>
          <p className="text-3xl font-bold mt-3">{analytics.totalOrders}</p>
        </div>

        <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Low Stock Products
          </p>
          <p className="text-3xl font-bold mt-3 text-red-500">
            {analytics.lowStockProducts}
          </p>
        </div>
      </div>

      {/* ================= CHARTS SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Order Status Pie */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 transition-all duration-300">
          <h2 className="text-lg font-semibold mb-6">Order Status Breakdown</h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 transition-all duration-300">
          <h2 className="text-lg font-semibold mb-6">Monthly Revenue</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => `₹ ${value}`} />
              <Bar dataKey="amount" fill="#111827" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
