import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/Api";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("LOGIN RESPONSE:", res.data);

      login(res.data);

      if (res.data.role === "CUSTOMER") {
        navigate("/customer");
      }

      if (res.data.role === "VENDOR") {
        navigate("/vendor");
      }

      if (res.data.role === "ADMIN") {
        navigate("/admin");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials.");
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
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue to your dashboard
          </p>
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                     bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500
                     transition-all duration-200"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full py-3 rounded-xl bg-black dark:bg-blue-600 
                   text-white font-medium shadow-md
                   hover:shadow-lg hover:scale-[1.02] 
                   active:scale-[0.97] cursor-pointer
                   transition-all duration-200"
          onClick={handleLogin}
        >
          Sign In
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <span className="px-4 text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-black dark:text-blue-400 font-medium 
                     cursor-pointer hover:underline transition"
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
