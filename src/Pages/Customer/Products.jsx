import { useState, useEffect } from "react";
import api from "../../services/Api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [direction, setDirection] = useState("asc");
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false); // UI only

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products", {
        params: {
          page,
          size: 6,
          search: search || undefined,
          categoryId: categoryId || undefined,
          sortBy,
          direction,
        },
      });

      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products.");
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const res = await api.post(`/api/wishlist/${productId}`);
      toast.success(res.data);

      setWishlistIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      );

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Wishlist failed");
    }
  };

  const handleAddToCart = async (id) => {
    try {
      await api.post(`/api/cart/add?productId=${id}&quantity=1`);
      toast.success("Added to cart.");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart.");
    }
  };

  useEffect(() => {
    setPage(0);
  }, [search, categoryId, sortBy, direction]);

  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryId, sortBy, direction]);

  useEffect(() => {
    fetchCategories();
    fetchWishlistIds();
  }, []);

  const fetchWishlistIds = async () => {
    try {
      const res = await api.get("/api/wishlist");
      setWishlistIds(res.data.map((p) => p.id));
    } catch {}
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load categories");
    }
  };

  return (
    <div className="space-y-8">
      <div className="sm:hidden">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="w-full bg-black dark:bg-blue-600 text-white py-3 rounded-xl font-medium shadow-md transition-all duration-200"
        >
          {showFilters ? "Close Filters" : "Filter & Sort"}
        </button>
      </div>

      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-all duration-300 ${
          showFilters ? "block" : "hidden sm:block"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
            bg-gray-50 dark:bg-gray-900 
            text-gray-800 dark:text-gray-100
            focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
            bg-gray-50 dark:bg-gray-900 
            text-gray-800 dark:text-gray-100
            focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
            bg-gray-50 dark:bg-gray-900 
            text-gray-800 dark:text-gray-100
            focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price">Sort by Price</option>
            <option value="name">Sort by Name</option>
          </select>

          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
            bg-gray-50 dark:bg-gray-900 
            text-gray-800 dark:text-gray-100
            focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <button
            onClick={() => {
              setPage(0);
              fetchProducts();
            }}
            className="w-full cursor-pointer bg-black dark:bg-blue-600 text-white rounded-xl px-4 py-3 font-medium shadow-md hover:shadow-lg active:scale-[0.97] transition"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {products.length} results
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/customer/product/${product.id}`)}
          >
            <div className="relative bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
              <img
                src={
                  product.imageUrls && product.imageUrls.length > 0
                    ? product.imageUrls[0]
                    : "/no-image.png"
                }
                alt={product.name}
                className="h-40 object-contain transition-transform duration-300 group-hover:scale-105"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={`absolute top-4 right-4 text-2xl cursor-pointer transition-transform duration-200 hover:scale-125 ${
                  wishlistIds.includes(product.id)
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                ♥
              </button>
            </div>

            <div className="p-6 space-y-3">
              <h2 className="font-semibold text-lg line-clamp-1">
                {product.name}
              </h2>

              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                ₹ {product.price}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product.id);
                }}
                className="w-full bg-black dark:bg-blue-600 text-white rounded-xl py-2.5 font-medium shadow-md hover:shadow-lg active:scale-[0.97] transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-3 pt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-4 py-2 rounded-xl font-medium transition cursor-pointer ${
                page === i
                  ? "bg-black dark:bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
