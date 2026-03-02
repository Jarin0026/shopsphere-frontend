import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function VendorLayout() {
  const { logout } = useAuth();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 dark:bg-gray-800 text-white
        flex flex-col justify-between px-6 py-8 shadow-2xl z-40
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-10">
            Vendor Panel
          </h2>

          <nav className="space-y-3 text-sm font-medium">
            <Link
              to="/vendor"
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 hover:translate-x-1"
            >
              Dashboard
            </Link>

            <Link
              to="/vendor/products"
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 hover:translate-x-1"
            >
              My Products
            </Link>

            <Link
              to="/vendor/orders"
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 hover:translate-x-1"
            >
              Orders
            </Link>

            <Link
              to="/vendor/create-product"
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 hover:translate-x-1"
            >
              Add Product
            </Link>
          </nav>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full py-3 rounded-xl font-medium shadow-md
            bg-gray-700 hover:bg-gray-600
            transition-all duration-300 cursor-pointer"
          >
            {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>

          <button
            onClick={logout}
            className="w-full py-3 rounded-xl font-medium
            bg-white text-black shadow-md
            hover:shadow-lg hover:scale-[1.02] active:scale-[0.97]
            transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center justify-between px-4 py-4 bg-white dark:bg-gray-800 shadow">
          <button onClick={() => setSidebarOpen(true)} className="text-xl">
            ☰
          </button>

          <span className="font-semibold">Vendor Panel</span>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10 min-h-full transition-all duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default VendorLayout;
