import React, { useContext, useEffect, useState } from "react";

// Libraries
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Hooks
import { lenis, useLenisScroll } from "./lib/useLenisScroll";
import ScrollToTop from "./components/ScrollToTop";

// Layouts
import RootLayouts from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

// Components
import CookieConsent from "./components/CookieConsent";

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
import Contact from "./pages/root pages/Contact";
import PrivacyPolicy from "./pages/root pages/PrivacyPolicy";
import TermsOfService from "./pages/root pages/TermsOfService";
import Faq from "./pages/root pages/Faq";
import ShippingInfo from "./pages/root pages/ShippingInfo";
import SizeGuide from "./pages/root pages/SizeGuide";
import Unsubscribe from "./pages/root pages/Unsubscribe";

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
import AdminProducts from "./pages/admin pages/AdminProducts";
import AdminCreateProduct from "./pages/admin pages/AdminCreateProduct";
import AdminUpdateProduct from "./pages/admin pages/AdminUpdateProduct";
import AdminUsers from "./pages/admin pages/AdminUsers";
import AdminUserDetails from "./pages/admin pages/AdminUserDetails";
import AdminCoupons from "./pages/admin pages/AdminCoupons";
import AdminSubscribers from "./pages/admin pages/AdminSubscribers";
import AdminSendEmailToSubscribers from "./pages/admin pages/AdminSendEmailToSubscribers";
import AdminProductDetails from "./pages/admin pages/AdminProductDetails";
import AdminSettings from "./pages/admin pages/AdminSettings";
import AdminRefunds from "./pages/admin pages/AdminRefunds";

// 404 page
import ErrorPage from "./pages/root pages/ErrorPage";

// Context
import { AuthContext } from "./context/AuthContext/AuthContext";
import { mainLogo } from "./assets";
import { appear } from "./lib/anim";

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [animation, setAnimation] = useState<Boolean>(true);
  useLenisScroll();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.cursor = "wait";
    const timer = setTimeout(() => {
      setAnimation(false);
      document.body.style.cursor = "default";
      document.body.style.overflow = "auto";

      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
      document.body.style.cursor = "default";
    };
  }, []);

  return (
    <div>
      {animation && (
        <AnimatePresence mode="wait">
          <Animation />
        </AnimatePresence>
      )}
      <Toaster position="top-right" style={{ fontFamily: "poppins" }} />
      <Router>
        <CookieConsent />
        <ScrollToTop />
        <Routes>
          {/* Root Layout with common pages */}
          <Route element={<RootLayouts />}>
            <Route path="/" element={<Home />} />
            <Route path="/collections/shop_all" element={<ShopAll />} />
            <Route path="/collections/new_arrivals" element={<NewArrivals />} />
            <Route path="/collections/Active_wears" element={<ActiveWears />} />
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
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy_policy" element={<PrivacyPolicy />} />
            <Route path="/terms_of_service" element={<TermsOfService />} />
            <Route path="/faqs" element={<Faq />} />
            <Route path="/shipping_info" element={<ShippingInfo />} />
            <Route path="/size_guide" element={<SizeGuide />} />
            <Route path="/unsubscribe/:token" element={<Unsubscribe />} />
            <Route path="/order_confirmation" element={<OrderConfirmation />} />
            <Route path="/order_details/:id" element={<OrderDetails />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout animation={animation} />}>
            <Route path="/auth/Sign_in" element={<SignIn />} />
            <Route path="/auth/sign_up" element={<SignUp />} />
            <Route path="/auth/forget_password" element={<ForgetPassword />} />
            <Route
              path="/auth/reset_password/:token"
              element={<ResetPassword />}
            />
          </Route>

          {/* Admin Routes (Only accessible to admins) */}
          {user?.isAdmin ? (
            <Route element={<AdminLayout animation={animation} />}>
              <Route path="/admin" element={<AdminAnalytics />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route
                path="/admin/orders/pending"
                element={<AdminPendingOrders />}
              />
              <Route
                path="/admin/orders/delivered"
                element={<AdminDeliveredOrders />}
              />
              <Route path="/admin/orders/refunds" element={<AdminRefunds />} />
              <Route
                path="/admin/orders/order_details/:id"
                element={<AdminOrderDetails />}
              />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route
                path="/admin/products/product_details/:id"
                element={<AdminProductDetails />}
              />
              <Route
                path="/admin/products/create_product"
                element={<AdminCreateProduct />}
              />
              <Route
                path="/admin/products/update_product/:id"
                element={<AdminUpdateProduct />}
              />
              <Route path="/admin/customers" element={<AdminUsers />} />
              <Route
                path="/admin/customers/customer_details/:id"
                element={<AdminUserDetails />}
              />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/subscribers" element={<AdminSubscribers />} />

              <Route
                path="/admin/email-to-subscribers"
                element={<AdminSendEmailToSubscribers />}
              />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          ) : null}

          {/* 404 Route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
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
