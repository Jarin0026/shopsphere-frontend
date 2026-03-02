import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/Api";
import toast from "react-hot-toast";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/api/wishlist");
      setProducts(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load wishlist.");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.post(`/api/wishlist/${productId}`);

      toast.success(res.data);

      setProducts((prev) => prev.filter((product) => product.id !== productId));

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove from wishlist.",
      );
    }
  };

  // if (!products.length) {
  //   return <h2>No items in wishlist.</h2>;
  // }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-semibold tracking-tight">My Wishlist</h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {products.length} item{products.length !== 1 && "s"}
          </p>
        </div>
      </div>

      {products.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center space-y-6 transition-all duration-300">
          <div className="text-6xl">💔</div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your wishlist is empty</h2>

            <p className="text-gray-500 dark:text-gray-400">
              Save your favorite products and buy them later.
            </p>
          </div>

          <button
            onClick={() => navigate("/api/customer")}
            className="px-6 py-3 rounded-xl bg-black dark:bg-blue-600 text-white 
          font-medium shadow-md hover:shadow-lg 
          hover:scale-[1.02] active:scale-[0.97] 
          transition-all duration-200 cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => navigate(`/api/customer/product/${product.id}`)}
            >
              <div className="relative bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
                <img
                  src={product.imageUrls?.[0] || "/no-image.png"}
                  alt={product.name}
                  loading="lazy"
                  className="h-40 object-contain transition-transform duration-300 group-hover:scale-105"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-4 right-4 text-2xl cursor-pointer text-red-500 
                hover:scale-125 transition-transform duration-200"
                >
                  ♥
                </button>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-xl font-bold text-gray-900 dark:text-gray-200">
                  ₹ {product.price}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/api/customer/product/${product.id}`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-black dark:bg-blue-600 text-white 
                font-medium shadow-md hover:shadow-lg 
                hover:scale-[1.02] active:scale-[0.97] 
                transition-all duration-200 cursor-pointer"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
