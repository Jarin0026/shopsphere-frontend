import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/Api";
import toast from "react-hot-toast";

function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/api/addresses");
      setAddresses(res.data);
      console.log(res.data);

      const defaultAddr = res.data.find((a) => a.default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load addresses.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select address.");
      return;
    }

    try {
      const res = await api.post(
        `/api/orders/checkout?addressId=${selectedAddress}`,
      );
      const orderId = res.data.split(":")[1]?.trim();
      navigate(`/api/customer/payment/${orderId}`);
      toast.success("Ordered created. Proceed to payment.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = async () => {
    try {
      await api.post("/api/addresses", newAddress);

      toast.success("Address added successfully");

      setShowForm(false);
      setNewAddress({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        isDefault: false,
      });

      fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address.");
    }
  };

  return (
    <div className="space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
      >
        ← Back
      </button>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Select Delivery Address
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Choose an address for your order delivery.
        </p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="px-6 py-3 rounded-xl bg-black cursor-pointer dark:bg-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
      >
        {showForm ? "Close Address Form" : "+ Add New Address"}
      </button>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 space-y-4 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="fullName"
              placeholder="Full Name"
              className="input-field"
              value={newAddress.fullName}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              className="input-field"
              value={newAddress.phone}
              onChange={handleChange}
            />

            <input
              name="street"
              placeholder="Street Address"
              className="input-field md:col-span-2"
              value={newAddress.street}
              onChange={handleChange}
            />

            <input
              name="city"
              placeholder="City"
              className="input-field"
              value={newAddress.city}
              onChange={handleChange}
            />

            <input
              name="state"
              placeholder="State"
              className="input-field"
              value={newAddress.state}
              onChange={handleChange}
            />

            <input
              name="zipCode"
              placeholder="Zip Code"
              className="input-field"
              value={newAddress.zipCode}
              onChange={handleChange}
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              name="isDefault"
              checked={newAddress.isDefault}
              onChange={handleChange}
              className="h-4 w-4 accent-black dark:accent-blue-500"
            />
            Set as default address
          </label>

          <button
            onClick={handleAddAddress}
            className="px-6 py-3 rounded-xl cursor-pointer bg-black dark:bg-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            Save Address
          </button>
        </div>
      )}

      <div className="space-y-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            onClick={() => setSelectedAddress(address.id)}
            className={`group p-6 rounded-2xl border cursor-pointer transition-all duration-300
            ${
              selectedAddress === address.id
                ? "border-black dark:border-blue-500 bg-gray-50 dark:bg-gray-800 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:shadow-md"
            }`}
          >
            <div className="flex gap-4">
              <input
                type="radio"
                checked={selectedAddress === address.id}
                onChange={() => setSelectedAddress(address.id)}
                className="mt-1 accent-black dark:accent-blue-500"
              />

              <div className="space-y-1">
                <p className="font-semibold">{address.fullName}</p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {address.street}, {address.city} - {address.zipCode}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {address.phone}
                </p>

                {address.default && (
                  <span className="inline-block text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full mt-2">
                    Default Address
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center space-y-4">
            <div className="text-5xl">📍</div>
            <p className="text-gray-500 dark:text-gray-400">
              No addresses found. Please add one to continue.
            </p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white dark:bg-gray-900 py-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handlePlaceOrder}
          className="w-full cursor-pointer md:w-auto px-10 py-4 mx-8 rounded-2xl bg-black dark:bg-blue-600 text-white text-lg font-semibold shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}

export default Checkout;
