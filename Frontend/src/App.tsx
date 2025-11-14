import React, { useContext, useEffect, useState } from "react";

// Libraries
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Hooks
import { useLenisScroll } from "./lib/useLenisScroll";
import ScrollToTop from "./components/ScrollToTop";

// Layouts
import RootLayouts from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

// Components

// Root Pages
import Home from "./pages/root pages/Home";
import ShopAll from "./pages/root pages/ShopAll";
import NewArrivals from "./pages/root pages/NewArrivals";
import ActiveWears from "./pages/root pages/ActiveWears";
import FitnessAccessories from "./pages/root pages/FitnessAccessories";
import ProductDetails from "./pages/root pages/ProductDetails";
import SearchResults from "./pages/root pages/SearchResults";
import Cart from "./pages/root pages/Cart";
import WishLists from "./pages/root pages/WishLists";
import Checkout from "./pages/root pages/CheckOut";
import OrderConfirmation from "./pages/root pages/OrderConfirmation";
import Profile from "./pages/root pages/Profile";
import OrderDetails from "./pages/root pages/OrderDetails";

// Auth Pages
import SignIn from "./pages/auth pages/SignIn";
import SignUp from "./pages/auth pages/SignUp";
import ForgetPassword from "./pages/auth pages/ForgetPassword";
import ResetPassword from "./pages/auth pages/ResetPassword";

// Admin Pages
import AdminAnalytics from "./pages/admin pages/AdminAnalytics";
import AdminOrders from "./pages/admin pages/AdminOrders";
import AdminPendingOrders from "./pages/admin pages/AdminPendingOrders";
import AdminDeliveredOrders from "./pages/admin pages/AdminDeliveredOrders";
import AdminOrderDetails from "./pages/admin pages/AdminOrderDetails";
import AdminAddProduct from "./pages/admin pages/AdminAddProduct";
import AdminUsers from "./pages/admin pages/AdminUsers";
import AdminUserDetails from "./pages/admin pages/AdminUserDetails";
import AdminBestSellers from "./pages/admin pages/AdminBestSellers";
import AdminNewArrivals from "./pages/admin pages/AdminNewArrivals";
import AdminUpdateProduct from "./pages/admin pages/AdminUpdateProduct";
import AdminProducts from "./pages/admin pages/AdminProducts";
import AdminSubscribers from "./pages/admin pages/AdminSubscribers";
import AdminSendEmailToSubscribers from "./pages/admin pages/AdminSendEmailToSubscribers";
import AdminProductDetails from "./pages/admin pages/AdminProductDetails";

// 404 page
import ErrorPage from "./pages/root pages/ErrorPage";

// Context
import { AuthContext } from "./context/AuthContext/AuthContext";
import { mainLogo } from "./assets";
import { appear } from "./lib/anim";

// import { Navbar2 } from "./pages/admin pages/AdminNavbar";

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [animation, setAnimation] = useState<Boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimation(false);
      window.scrollTo(0, 0);
    }, 6000);
  }, []);

  useLenisScroll();

  return (
    <div>
      <Toaster position="top-right" style={{ fontFamily: "poppins" }} />
      {animation ? (
        <AnimatePresence mode="wait">
          <Animation />
        </AnimatePresence>
      ) : (
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Root Layout with common pages */}
            <Route element={<RootLayouts />}>
              <Route path="/" element={<Home />} />
              <Route path="/collections/shop_all" element={<ShopAll />} />
              <Route
                path="/collections/new_arrivals"
                element={<NewArrivals />}
              />
              <Route
                path="/collections/Active_wears"
                element={<ActiveWears />}
              />
              <Route
                path="/collections/Fitness_accessories"
                element={<FitnessAccessories />}
              />
              <Route
                path="/collections/search/:name"
                element={<SearchResults />}
              />
              <Route path="/product_details/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlists" element={<WishLists />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/check_out" element={<Checkout />} />
              <Route
                path="/order_confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/order_details/:id" element={<OrderDetails />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout animation={animation} />}>
              <Route path="/auth/Sign_in" element={<SignIn />} />
              <Route path="/auth/sign_up" element={<SignUp />} />
              <Route
                path="/auth/forget_password"
                element={<ForgetPassword />}
              />
              <Route
                path="/auth/reset_password/:token"
                element={<ResetPassword />}
              />
            </Route>

            {/* Admin Routes (Only accessible to admins) */}
            {user?.isAdmin ? (
              <Route element={<AdminLayout animation={animation} />}>
                <Route path="/admin" element={<AdminAnalytics />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route
                  path="/admin/user_details/:id"
                  element={<AdminUserDetails />}
                />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route
                  path="/admin/product_details/:id"
                  element={<AdminProductDetails />}
                />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route
                  path="/admin/orders/pending"
                  element={<AdminPendingOrders />}
                />
                <Route
                  path="/admin/orders/delivered"
                  element={<AdminDeliveredOrders />}
                />
                <Route
                  path="/admin/order_details/:id"
                  element={<AdminOrderDetails />}
                />
                <Route
                  path="/admin/add_product"
                  element={<AdminAddProduct />}
                />
                <Route
                  path="/admin/best_sellers"
                  element={<AdminBestSellers />}
                />
                <Route
                  path="/admin/new_arrivals"
                  element={<AdminNewArrivals />}
                />
                <Route
                  path="/admin/subscribers"
                  element={<AdminSubscribers />}
                />
                <Route
                  path="/admin/email-to-subscribers"
                  element={<AdminSendEmailToSubscribers />}
                />
                <Route
                  path="/admin/update_product/:id"
                  element={<AdminUpdateProduct />}
                />
              </Route>
            ) : null}

            {/* 404 Route */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      )}
    </div>
  );
};

const Animation = () => {
  return (
    <motion.div
      variants={appear}
      initial="open"
      exit="closed"
      className="h-screen fixed inset-0 flex items-center justify-center bg-white !z-50 transition-opacity"
    >
      <div>
        <img src={mainLogo} alt="Animation logo" className="h-10" />
      </div>
    </motion.div>
  );
};

export default App;
