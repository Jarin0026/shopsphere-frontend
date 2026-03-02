import { useEffect, useState } from "react";
import api from "../../services/Api.js";
import toast from "react-hot-toast";

function CreatevendorOrders() {
  const [statusFilter, setStatusFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = !statusFilter || order.status === statusFilter;

    const matchesCustomer =
      !customerFilter ||
      order.customerName.toLowerCase().includes(customerFilter.toLowerCase());

    const matchesProduct =
      !productFilter ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(productFilter.toLowerCase()),
      );

    const matchesMin = !minPrice || order.totalAmount >= Number(minPrice);

    const matchesMax = !maxPrice || order.totalAmount <= Number(maxPrice);

    return (
      matchesStatus &&
      matchesCustomer &&
      matchesProduct &&
      matchesMin &&
      matchesMax
    );
  });

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/vendor/orders");
      setOrders(res.data);
      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders.");
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, null, {
        params: { status: newStatus },
      });
      toast.success(`Order update to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed.");
    }
  };

  const getNextActions = (status) => {
    switch (status) {
      case "CONFIRMED":
        return ["PACKED"];
      case "PACKED":
        return ["SHIPPED"];
      case "SHIPPED":
        return ["DELIVERED"];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-10">
      
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Manage Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Track and update order statuses efficiently.
        </p>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PACKED">PACKED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>

          <input
            type="text"
            placeholder="Customer Name"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="input-field"
          />

          <input
            type="text"
            placeholder="Product Name"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="input-field"
          />

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input-field"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center space-y-4">
          <div className="text-5xl">📦</div>
          <p className="text-gray-500 dark:text-gray-400">
            No orders match your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredOrders.map((order) => {
            const statusColor =
              order.status === "DELIVERED"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : order.status === "SHIPPED"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : order.status === "PACKED"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";

            return (
              <div
                key={order.orderId}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-8"
              >
                
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">
                      Order #{order.orderId}
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Customer: {order.customerName}
                    </p>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-lg font-bold">₹ {order.totalAmount}</div>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span>{item.productName}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>₹ {item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                  {getNextActions(order.status).map((action) => (
                    <button
                      key={action}
                      onClick={() => updateStatus(order.orderId, action)}
                      className="px-5 py-2 cursor-pointer rounded-xl bg-black dark:bg-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                      Mark {action}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CreatevendorOrders;
