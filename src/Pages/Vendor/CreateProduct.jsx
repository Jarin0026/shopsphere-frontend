import { useEffect, useState } from "react";
import api from "../../services/Api";
import toast from "react-hot-toast";

function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load categories");
    }
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.price ||
      !form.stock ||
      !form.categoryId
    ) {
      toast.error("All fields are required");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("categoryId", form.categoryId);

      images.forEach((file) => {
        formData.append("images", file);
      });

      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created successfully");

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
      });
      setImages([]);
      setPreviews([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">
          Add New Product
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Fill in product details, pricing, stock, and upload images.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-8 transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input-field"
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="input-field"
          />

          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="input-field"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Product Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-field min-h-[120px]"
        />

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Upload Product Images</h3>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-gray-500 dark:text-gray-400 cursor-pointer hover:border-black dark:hover:border-blue-500 transition">
            <span className="text-sm">Click to upload or drag images here</span>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);

                setImages((prev) => [...prev, ...files]);

                const previewUrls = files.map((file) =>
                  URL.createObjectURL(file),
                );

                setPreviews((prev) => [...prev, ...previewUrls]);

                e.target.value = null;
              }}
              className="hidden"
            />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {previews.map((src, index) => (
                <div
                  key={index}
                  className="relative group rounded-2xl overflow-hidden shadow-md"
                >
                  <img
                    src={src}
                    alt="preview"
                    className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full md:w-auto px-10 py-4 rounded-2xl 
  text-white font-semibold shadow-md transition-all cursor-pointer duration-200
  ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-black dark:bg-blue-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.97]"
  }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Creating...
              </div>
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
