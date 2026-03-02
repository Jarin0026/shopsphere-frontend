import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import api from "../services/Api";
import toast from "react-hot-toast";

function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMonthlyRevenue();
  }, []);

  const fetchMonthlyRevenue = async () => {
    try {
      const res = await api.get("/admin/monthly-revenue");

      const monthOrder = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
      ];

      const formatted = monthOrder.map((month) => ({
        month: month.substring(0, 3), // Jan, Feb, Mar
        revenue: res.data[month] || 0,
      }));

      setData(formatted);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load revenue chart.",
      );
    }
  };

  return (
    <div className="chart-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Monthly Revenue</h2>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              }}
              formatter={(value) => `₹ ${value}`}
            />
            <Bar dataKey="revenue" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;
