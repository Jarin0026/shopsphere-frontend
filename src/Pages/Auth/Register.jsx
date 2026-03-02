import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/Api";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", form);

      toast.success(res.data.message);

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
                  bg-gradient-to-br from-gray-100 via-white to-gray-200 
                  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                  px-4"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-800 
                    rounded-3xl shadow-xl p-8 sm:p-10 
                    transition-all duration-300"
      >
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-semibold tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join the platform and start your journey
          </p>
        </div>

        <div className="space-y-2 mb-5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Niraj Kumar Mahto"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                     bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500
                     transition-all duration-200"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="space-y-2 mb-5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                     bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500
                     transition-all duration-200"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="space-y-2 mb-5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a strong password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                     bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500
                     transition-all duration-200"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Account Type
          </label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                     bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500
                     transition-all duration-200"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="VENDOR">Vendor</option>
          </select>
        </div>

        <button
          onClick={handleRegister}
          className="w-full py-3 rounded-xl bg-black dark:bg-blue-600 
                   text-white font-medium shadow-md cursor-pointer
                   hover:shadow-lg hover:scale-[1.02]
                   active:scale-[0.97]
                   transition-all duration-200"
        >
          Create Account
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <span className="px-4 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-black dark:text-blue-400 font-medium cursor-pointer hover:underline transition"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
