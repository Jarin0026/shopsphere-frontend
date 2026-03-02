import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function AdminLayout() {
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
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <aside
        className={`fixed md:sticky top-0 left-0 h-full w-72 
        bg-white dark:bg-gray-800 shadow-2xl z-50
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Admin Panel
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Management Console
            </p>
          </div>

          <nav className="flex-1 space-y-2 text-sm font-medium">
            <Link
              to="/admin"
              className="block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Overview
            </Link>

            <Link
              to="/admin/users"
              className="block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Users
            </Link>

            <Link
              to="/admin/orders"
              className="block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Orders
            </Link>

            <Link
              to="/admin/categories"
              className="block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Categories
            </Link>
          </nav>

          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="w-full cursor-pointer py-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:scale-[1.02] transition"
            >
              {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
            </button>

            <button
              onClick={logout}
              className="w-full py-3 rounded-xl cursor-pointer bg-black dark:bg-red-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="md:hidden flex cursor-pointer items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 dark:text-gray-200"
          >
            ☰
          </button>
          <span className="font-semibold">Admin</span>
        </div>

        <main className="flex-1 p-6 md:p-10">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 md:p-10 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
