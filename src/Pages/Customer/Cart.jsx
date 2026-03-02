import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../../services/Api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart");
      setCart(res.data);
      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load cart.");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/api/cart/update?cartItemId=${itemId}&quantity=${quantity}`);
      toast.success("Cart updated.");

      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed.");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/api/cart/remove/${itemId}`);
      toast.success("Item removed.");
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Removed failed");
    }
  };

  const handleCheckout = () => {
    setCheckoutLoading(true);

    // Optional small delay for better UX feel
    setTimeout(() => {
      navigate("/api/customer/checkout");
    }, 400);
  };

  // if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-black cursor-pointer dark:hover:text-white transition"
        >
          ← Continue Shopping
        </button>

        <h1 className="text-4xl font-semibold tracking-tight">Shopping Cart</h1>

        <p className="text-gray-500 dark:text-gray-400">
          Review your items before checkout.
        </p>
      </div>

      {(!cart || cart.items.length === 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-16 text-center space-y-6">
          <div className="text-7xl">🛒</div>
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Start adding products to your cart.
          </p>

          <button
            onClick={() => navigate("/customer")}
            className="px-8 py-3 rounded-2xl bg-black dark:bg-blue-600 text-white font-medium shadow-md hover:shadow-xl hover:scale-[1.03] transition cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      )}

      {cart && cart.items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="group bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col sm:flex-row gap-6"
              >
                <div className="flex-1 space-y-2">
                  <h2 className="text-lg font-semibold">{item.productName}</h2>

                  <p className="text-gray-500 dark:text-gray-400">
                    ₹ {item.price}
                  </p>

                  <p className="font-medium text-gray-900 dark:text-white">
                    Subtotal: ₹ {item.subtotal}
                  </p>

                  <div className="flex items-center gap-6 pt-3">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden">
                      <button
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-40"
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span className="px-5 font-medium">{item.quantity}</span>

                      <button
                        className=" cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className=" cursor-pointer text-red-500 hover:underline text-sm"
                      onClick={() => removeItem(item.cartItemId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6 h-fit lg:sticky lg:top-12">
            <h2 className="text-2xl font-semibold">Order Summary</h2>

            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{cart.items.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹ {cart.total}</span>
            </div>

            <button
              onClick={() => navigate("/customer/checkout")}
              className="w-full py-4 rounded-2xl bg-black dark:bg-blue-600 text-white font-semibold text-lg shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.97] transition-all cursor-pointer duration-200"
            >
              Proceed to Checkout
            </button>

            <div className="text-xs text-gray-400 text-center pt-4">
              🔒 Secure Checkout • 100% Safe Payment
            </div>
          </div>
        </div>
      )}

      {cart && cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl p-4 lg:hidden flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total
            </div>
            <div className="text-lg font-bold">₹ {cart.total}</div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className={`px-6 py-3 rounded-xl text-white font-medium shadow-md transition-all duration-300
    ${
      checkoutLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black dark:bg-blue-600 hover:scale-[1.02] active:scale-[0.97]"
    }`}
          >
            {checkoutLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              "Checkout"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
