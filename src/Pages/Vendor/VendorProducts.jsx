import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/Api.js";
import toast from "react-hot-toast";

function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/vendor/products", {
        params: {
          page,
          size: 6,
          search: search || undefined,
          categoryId: categoryId || undefined,
        },
      });

      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product delete successfully.");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">My Products</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Manage, edit, and track your listed products.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by product name..."
            className="input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input-field"
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

          <button
            onClick={() => {
              setPage(0);
              fetchProducts();
            }}
            className="w-full py-3 rounded-xl bg-black dark:bg-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center space-y-4">
          <div className="text-5xl">📦</div>
          <p className="text-gray-500 dark:text-gray-400">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 flex items-center justify-center mb-5">
                <img
                  src={product.imageUrls?.[0] || "/no-image.png"}
                  alt={product.name}
                  className="h-40 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 space-y-2">
                <h2 className="font-semibold text-lg">{product.name}</h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  ₹ {product.price}
                </p>

                <p
                  className={`text-sm font-medium ${
                    product.stock < 5
                      ? "text-red-500"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  Stock: {product.stock}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => navigate(`/vendor/edit-product/${product.id}`)}
                  className="flex-1 py-2 rounded-xl bg-blue-600 cursor-pointer text-white font-medium hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 py-2 rounded-xl cursor-pointer bg-red-500 text-white font-medium hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 pt-4 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                page === i
                  ? "bg-black dark:bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow"
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

export default VendorProducts;
