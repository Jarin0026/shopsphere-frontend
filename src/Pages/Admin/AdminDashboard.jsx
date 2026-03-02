import { useEffect, useState } from "react";
import api from "../../services/Api";
import toast from "react-hot-toast";
import StatusChart from "./StatusChart";
import LowStockPanel from "../../components/LowStockPanel";
import KpiCard from "../../components/KpiCard";
import RevenueChart from "../../components/RevenueChart";

function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/api/admin/analytics");
      setData(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load analytics.");
    }
  };

  if (!data) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-xl w-1/3"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
        </div>

        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Platform Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
          Monitor users, vendors, orders, and platform performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card">
          <KpiCard title="Total Users" value={data.totalUsers} color="blue" />
        </div>

        <div className="dashboard-card">
          <KpiCard
            title="Total Vendors"
            value={data.totalVendors}
            color="purple"
          />
        </div>

        <div className="dashboard-card">
          <KpiCard
            title="Total Orders"
            value={data.totalOrders}
            color="orange"
          />
        </div>

        <div className="dashboard-card">
          <KpiCard
            title="Total Revenue"
            value={`₹ ${data.totalRevenue}`}
            color="green"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="dashboard-card p-6 md:p-8">
          <h2 className="text-lg font-semibold mb-6">Revenue Overview</h2>
          <RevenueChart />
        </div>

        <div className="dashboard-card p-6 md:p-8">
          <h2 className="text-lg font-semibold mb-6">
            Order Status Distribution
          </h2>
          <StatusChart statusBreakdown={data.statusBreakdown} />{" "}
        </div>
      </div>

      <div className="dashboard-card p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6">Inventory Alerts</h2>
        <LowStockPanel count={data.lowStockProducts} />
      </div>
    </div>
  );
}

export default AdminDashboard;
