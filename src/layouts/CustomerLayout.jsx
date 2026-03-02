import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../services/Api";

function CustomerLayout() {
  const { logout, user } = useAuth();

  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
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

  useEffect(() => {
    if (!user) return;

    fetchWishlistCount();
    fetchCartCount();

    const handleWishlistUpdate = () => fetchWishlistCount();
    const handleCartUpdate = () => fetchCartCount();

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user]);

  const fetchWishlistCount = async () => {
    try {
      const res = await api.get("/api/wishlist");
      setWishlistCount(res.data.length);
    } catch {
      setWishlistCount(0);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/api/cart");
      setCartCount(res.data.items?.length || 0);
    } catch {
      setCartCount(0);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar fixed top-0 left-0 h-full w-64 z-40 flex flex-col justify-between px-6 py-8 shadow-2xl transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static`}
      >
        <div>
          <h2 className="text-2xl font-semibold mb-10">Customer</h2>

          <nav className="space-y-3 text-sm font-medium">
            <Link
              to="/customer"
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Products
            </Link>

            <Link
              to="/customer/wishlist"
              className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/customer/cart"
              className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/customer/orders"
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              My Orders
            </Link>
          </nav>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn-primary w-full py-3 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
          >
            {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>

          <button
            onClick={logout}
            className="btn-logout w-full py-3 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
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
          <span className="font-semibold">Customer</span>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
