import { useEffect, useState } from "react";
import api from "../../services/Api";
import toast from "react-hot-toast";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/admin/categories");
      setCategories(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load categories.",
      );
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Category name required.");
      return;
    }

    try {
      await api.post("/api/admin/categories", null, {
        params: { name },
      });

      toast.success("Category created.");
      setName("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Create failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/categories/${id}`);
      toast.success("Category deleted.");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Manage Categories
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Create and manage product categories across the platform.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                     bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500
                     transition-all duration-200"
          />

          <button
            onClick={handleCreate}
            className="px-6 py-3 rounded-xl bg-black dark:bg-blue-600  cursor-pointer
                     text-white font-medium shadow-md 
                     hover:shadow-lg hover:scale-[1.02] 
                     active:scale-[0.97]
                     transition-all duration-200"
          >
            Create Category
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="text-5xl">📂</div>
            <p className="text-gray-500 dark:text-gray-400">
              No categories available.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-6 py-4 
                         hover:bg-gray-50 dark:hover:bg-gray-700 
                         transition duration-200"
              >
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {cat.name}
                </span>

                <button
                  onClick={() => handleDelete(cat.id)}
                  className="px-4 py-2 rounded-xl text-sm font-medium 
                           bg-red-600 text-white 
                           hover:bg-red-700 hover:shadow-md  cursor-pointer
                           active:scale-[0.96] 
                           transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;
