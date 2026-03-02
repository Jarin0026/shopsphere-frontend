import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load orders");
    }
  };

  const uniqueStatuses = [
    "ALL",
    ...new Set(orders.map((order) => order.status)),
  ];

  const filteredOrders =
    selectedStatus === "ALL"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <button
          onClick={() => navigate(-1)}
          className="text-sm cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-semibold tracking-tight">My Orders</h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Track and manage your previous purchases.
        </p>
      </div>

      {orders.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-600 
            rounded-xl px-4 py-3 pr-10 
            text-sm font-medium
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500
            transition"
            >
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              ▼
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center space-y-4">
          <div className="text-6xl">📦</div>

          <h2 className="text-xl font-semibold">No orders found</h2>

          <p className="text-gray-500 dark:text-gray-400">
            {selectedStatus === "ALL"
              ? "You haven’t placed any orders yet."
              : `No orders with status "${selectedStatus}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusColor =
              order.status === "DELIVERED"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";

            return (
              <div
                key={order.orderId}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6"
                onClick={() => navigate(`/customer/orders/${order.orderId}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Order Info */}
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">
                      Order #{order.orderId}
                    </p>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹ {order.totalAmount}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
