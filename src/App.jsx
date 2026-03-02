import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Auth/Login";
import ProtectectedRoute from "./components/ProtectedRoute";
import CustomerLayout from "./layouts/CustomerLayout";
import VendorLayout from "./layouts/VendorLayout";
import AdminLayout from "./layouts/AdminLayout";
import Products from "./Pages/Customer/Products";
import ProductDetails from "./Pages/Customer/ProductDetails";
import Cart from "./Pages/Customer/Cart";
import Checkout from "./Pages/Customer/Checkout";
import Payment from "./Pages/Customer/Payment";
import MyOrders from "./Pages/Customer/MyOrders";
import OrderDetails from "./Pages/Customer/OrderDetails";
import CreateProduct from "./Pages/Vendor/CreateProduct";
import Wishlist from "./Pages/Customer/Wishlist";
import VendorDashboard from "./Pages/Vendor/VendorDashboard";
import VendorProducts from "./Pages/Vendor/VendorProducts";
import CreatevendorOrders from "./Pages/Vendor/CreateVendorOrders";
import EditProduct from "./Pages/Vendor/EditProduct";
import AdminCategories from "./Pages/Admin/AdminCategories";
import AdminUsers from "./Pages/Admin/AdminUsers";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminOrders from "./Pages/Admin/AdminOrders";
import Register from "./Pages/Auth/Register";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/customer"
          element={
            <ProtectectedRoute role="CUSTOMER">
              <CustomerLayout />
            </ProtectectedRoute>
          }
        >
          <Route index element={<Products />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment/:orderId" element={<Payment />} />
          <Route path="orders" element={<MyOrders />} />{" "}
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>

        <Route
          path="/vendor"
          element={
            <ProtectectedRoute role="VENDOR">
              <VendorLayout />
            </ProtectectedRoute>
          }
        >
          <Route index element={<VendorDashboard />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="orders" element={<CreatevendorOrders />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectectedRoute role="ADMIN">
              <AdminLayout />
            </ProtectectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
