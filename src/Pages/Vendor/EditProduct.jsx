import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/Api.js";
import toast from "react-hot-toast";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);

      setForm({
        name: res.data.name || "",
        description: res.data.description || "",
        price: res.data.price || "",
        stock: res.data.stock || "",
        categoryId: res.data.categoryId || "",
      });

      setExistingImages(res.data.imageUrls || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load product.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load categories.",
      );
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages((prev) => [...prev, ...files]);

    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setPreviews((prev) => [...prev, ...previewUrls]);

    e.target.value = null;
  };

  const removeExistingImage = (index) => {
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
  };

  const removeNewImage = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedImages = images.filter((_, i) => i !== index);

    setPreviews(updatedPreviews);
    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("existingImages", JSON.stringify(existingImages));

      await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully 🚀");
      navigate("/vendor/products");
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-2">
        <button
          onClick={() => navigate(-1)}
          className="text-sm cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-semibold tracking-tight">Edit Product</h2>

        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Update product details, pricing, stock, and images.
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

        {existingImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Existing Images</h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {existingImages.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-2xl overflow-hidden shadow-md"
                >
                  <img
                    src={img}
                    alt=""
                    className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 cursor-pointer right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md hover:scale-110 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Upload New Images</h3>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-gray-500 dark:text-gray-400 cursor-pointer hover:border-black dark:hover:border-blue-500 transition">
            <span>Click to upload images</span>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
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
                    alt=""
                    className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute cursor-pointer top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md hover:scale-110 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full cursor-pointer md:w-auto px-10 py-4 rounded-2xl 
  text-white font-semibold shadow-md transition-all duration-200
  ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-black dark:bg-blue-600  hover:shadow-xl hover:scale-[1.02] active:scale-[0.97]"
  }`}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
