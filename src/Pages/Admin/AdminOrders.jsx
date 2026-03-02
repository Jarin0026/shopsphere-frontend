import { useEffect, useState } from "react";
import api from "../../services/Api";
import toast from "react-hot-toast";
import { data } from "autoprefixer";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/admin/orders", {
        params: {
          page,
          size: 8,
          search: search || undefined,
          status: statusFilter || undefined,
        },
      });

      setOrders(res.data.content);
      setTotalPages(res.data.totalPages);
      console.log(res.data.content);
      console.log(res.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/admin/orders/${id}/status?status=${status}`);
      toast.success(res.data);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="space-y-10">
      {/* ================= Header ================= */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Orders Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Search, filter and manage all platform orders.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field sm:w-56"
          >
            <option value="">All Status</option>
            <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PACKED">PACKED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <button
          onClick={() => {
            setPage(0);
            fetchOrders();
          }}
          className="px-6 py-3 rounded-xl cursor-pointer bg-black dark:bg-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          Apply Filters
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="text-5xl">📦</div>
            <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Order</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Created</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {orders.map((order) => {
                  const statusColor =
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : order.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : order.status === "PACKED"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";

                  return (
                    <tr
                      key={order.orderId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 font-medium">
                        #{order.orderId}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {order.customerEmail}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.orderId, e.target.value)
                          }
                          className={`px-3 py-2 rounded-xl text-xs font-medium border-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500 ${statusColor}`}
                        >
                          <option value="PENDING_PAYMENT">
                            PENDING_PAYMENT
                          </option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PACKED">PACKED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        ₹ {order.totalAmount}
                      </td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              page === i
                ? "bg-black dark:bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;
