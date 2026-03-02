import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/Api";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
    checkWishlist();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`products/${id}`);
      setProduct(res.data);

      if (res.data.imageUrls?.length > 0) {
        setSelectedImage(res.data.imageUrls[0]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products.");
    }
  };

  const checkWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      const exists = res.data.some((p) => p.id === Number(id));
      setIsWishlisted(exists);
    } catch (error) {
      toast.error();
    }
  };

  const toggleWishlist = async () => {
    try {
      const res = await api.post(`/wishlist/${id}`);
      toast.success(res.data);
      setIsWishlisted((prev) => !prev);
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Wishlist failed.");
    }
  };

  const handleAddToCart = async () => {
    try {
      await api.post(`/cart/add?productId=${id}&quantity=1`);
      toast.success("Added to cart.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to added to cart.");
    }
  };

  if (!product)
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-md">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );

  return (
    <div className="space-y-8">
      <button
        onClick={() => window.history.back()}
        className="text-sm text-gray-500 cursor-pointer dark:text-gray-400 hover:text-black dark:hover:text-white transition"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div
            className="relative w-full h-[420px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 
        rounded-3xl overflow-hidden flex items-center justify-center 
        shadow-xl transition-all duration-300"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Product"
                loading="lazy"
                onClick={() => setLightboxOpen(true)}
                className="h-full object-contain cursor-zoom-in transition-transform duration-500 hover:scale-110"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>

          <div className="flex gap-4 flex-wrap">
            {product.imageUrls?.map((url, index) => (
              <img
                key={index}
                src={url}
                loading="lazy"
                onClick={() => setSelectedImage(url)}
                className={`h-20 w-20 object-cover rounded-2xl cursor-pointer border-2 
              transition-all duration-300 hover:scale-105 ${
                selectedImage === url
                  ? "border-black dark:border-blue-500 shadow-lg"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹ {product.price}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

          <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
            {product.description}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-inner space-y-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Stock Available:{" "}
              <span className="font-medium">{product.stock}</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 cursor-pointer rounded-xl text-lg font-medium transition-all duration-300 shadow-md
      ${
        product.stock > 0
          ? "bg-black dark:bg-blue-600 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.97]"
          : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
      }`}
            >
              Add to Cart
            </button>

            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className={`w-full py-3 cursor-pointer rounded-xl font-medium border transition-all duration-300
      ${
        isWishlisted
          ? "bg-red-500 text-white border-red-500 hover:opacity-90"
          : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
            >
              {isWishlisted ? "🤍 Remove from Wishlist" : "💘 Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={selectedImage}
            className="max-h-[90%] max-w-[90%] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
