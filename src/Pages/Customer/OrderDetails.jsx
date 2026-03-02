import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/Api";
import toast from "react-hot-toast";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);

  useEffect(() => {
    fetchOrder();
    fetchTracking();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load order.");
    }
  };

  const fetchTracking = async () => {
    try {
      const res = await api.get(`/orders/${id}/tracking`);
      setTracking(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tracking.");
    }
  };

  const cancelOrder = async () => {
    try {
      await api.put(`/orders/${id}/cancel`);

      toast.success("Order cancelled.");
      fetchOrder();
      fetchTracking();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrder();
      fetchTracking();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!order) return <h2>Loading...</h2>;

  return (
    <div className="space-y-10 p-6">
      <div className="space-y-2">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-500 cursor-pointer dark:text-gray-400 hover:text-black dark:hover:text-white transition"
        >
          ← Back to Orders
        </button>

        <h1 className="text-3xl font-semibold tracking-tight">
          Order #{order.orderId}
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Track your order details and delivery updates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 space-y-6 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current Status
              </p>

              <span
                className={`inline-block mt-1 px-4 py-1 rounded-full text-sm font-medium ${
                  order.status === "DELIVERED"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Amount
              </p>
              <p className="text-2xl font-bold">₹ {order.totalAmount}</p>
            </div>
          </div>

          {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
            <button
              onClick={cancelOrder}
              className="px-6 py-3 rounded-xl bg-red-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
            >
              Cancel Order
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 space-y-4 h-fit lg:sticky lg:top-12">
          <h2 className="text-lg font-semibold">Order Overview</h2>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Items</span>
            <span>{order.items.length}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Status</span>
            <span>{order.status}</span>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹ {order.totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 space-y-6">
        <h2 className="text-xl font-semibold">Order Items</h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 transition"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="font-semibold">₹ {item.subtotal}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 space-y-6">
        <h2 className="text-xl font-semibold">Tracking Timeline</h2>

        <div className="relative border-l border-gray-300 dark:border-gray-600 pl-6 space-y-6">
          {tracking.map((t, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[16px] top-2 w-3 h-3  rounded-full bg-black dark:bg-blue-500"></div>

              <p className="font-medium">{t.status}</p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(t.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
