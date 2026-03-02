import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/Api";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const res = await api.post(`/payments/create-order?orderId=${orderId}`);

      const data = res.data;

      const options = {
        key: "rzp_test_SBg7pjGYuMNZQv",
        amount: data.amount,
        currency: data.currency,
        name: "ShopSphere",
        description: "Order Payment",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post("/payments/verify", null, {
              params: {
                orderId: orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
            });

            toast.success("Payment successful");
            navigate("/customer/orders");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition cursor-pointer"
        >
          ← Back
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 space-y-8 transition-all duration-300">
          <div className="text-center space-y-3">
            <div className="text-5xl">💳</div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Complete Your Payment
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Secure payment powered by Razorpay
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Order ID</span>
              <span className="font-medium text-gray-900 dark:text-white">
                #{orderId}
              </span>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex justify-between font-semibold text-lg ">
              <span className="mx-2">Proceed in Razorpay</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full py-4 rounded-2xl bg-black dark:bg-blue-600 text-white 
          text-lg font-semibold shadow-md hover:shadow-xl 
          hover:scale-[1.02] active:scale-[0.97] 
          transition-all duration-200 cursor-pointer"
          >
            Pay Now →
          </button>

          <div className="text-center text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>🔒 100% Secure Payment</p>
            <p>All transactions are encrypted & protected</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
