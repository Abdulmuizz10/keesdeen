import { useContext, useEffect, useState } from "react";
// Libraries
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

// Layouts
import RootLayouts from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

// Components
// import { Navbar7 } from "./components/Navbar";
// import { Footer1 } from "./components/Footer";

// Root Pages
import Home from "./pages/root pages/Home";
import ShopAll from "./pages/root pages/ShopAll";
import ActiveWear from "./pages/root pages/ActiveWear";
import ProductDetails from "./pages/root pages/ProductDetails";
import Collections from "./pages/root pages/Collections";
import Cart from "./pages/root pages/Cart";
import Checkout from "./pages/root pages/CheckOut";
import WishLists from "./pages/root pages/WishLists";
import NewArrivals from "./pages/root pages/NewArrivals";
import Profile from "./pages/root pages/Profile";

// Auth Pages
import { Login7 } from "./pages/auth pages/Login";
import { Signup7 } from "./pages/auth pages/SignUp";

// Admin Pages

import AdminHome from "./pages/admin pages/AdminHome";
import AdminOrders from "./pages/admin pages/AdminOrders";
import AddProducts from "./pages/admin pages/AddProducts";
import AdminDashBoardSales from "./pages/admin pages/AdminDashBoardSales";
import AdminDashBoardOrders from "./pages/admin pages/AdminDashBoardOrders";
import AdminProducts from "./pages/admin pages/AdminProducts";
import AdminCustomers from "./pages/admin pages/AdminCustomers";

// Context
import { AuthContext } from "./context/AuthContext/AuthContext";
import FitnessAccessories from "./pages/root pages/FitnessAccessories";
import { useProducts } from "./context/ProductContext/ProductContext";
import { getProducts } from "./context/ProductContext/ProductApiCalls";
import { mainLogo } from "./assets";
import { appear } from "./lib/anim";

// import { Navbar2 } from "./pages/admin pages/AdminNavbar";

const App: React.FC = () => {
  const [animation, setAnimation] = useState<Boolean>(true);
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });

  useEffect(() => {
    setTimeout(() => {
      setAnimation(false);
      window.scrollTo(0, 0);
      window.scrollTo(0, 0);
    }, 10000);
  }, []);

  const { user } = useContext(AuthContext);

  const { products, dispatch } = useProducts();

  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);

  return (
    <div className="overflow-x-hidden ">
      <ToastContainer />

      <AnimatePresence mode="wait">
        {animation && <Animation />}
      </AnimatePresence>
      <Router>
        <Routes>
          {/* Root Layout with common pages */}
          <Route element={<RootLayouts animation={animation} />}>
            <Route path="/" element={<Home animation={animation} />} />
            <Route path="/collections/shop_all" element={<ShopAll />} />
            <Route path="/collections/new_in" element={<NewArrivals />} />
            <Route path="/collections/Active_wear" element={<ActiveWear />} />
            <Route
              path="/collections/Fitness_accessories"
              element={<FitnessAccessories />}
            />
            <Route
              path="/collections/:name"
              element={<Collections products={products} />}
            />
            <Route
              path="/product_details/:id"
              element={<ProductDetails products={products} />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/wishlists"
              element={<WishLists products={products} />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/check_out"
              element={<Checkout products={products} />}
            />
          </Route>

          {/* Admin Routes (Only accessible to admins) */}
          {user?.isAdmin ? (
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route
                path="/admin/products"
                element={<AdminProducts items={products} />}
              />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/add_product" element={<AddProducts />} />
              <Route
                path="/admin/dashboard/sales"
                element={<AdminDashBoardSales />}
              />
              <Route
                path="/admin/dashboard/orders"
                element={<AdminDashBoardOrders />}
              />
            </Route>
          ) : null}

          {/* <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/add_product" element={<AddProducts />} />
            <Route
              path="/admin/dashboard/sales"
              element={<AdminDashBoardSales />}
            />
            <Route
              path="/admin/dashboard/orders"
              element={<AdminDashBoardOrders />}
            />
          </Route> */}

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/register/login" element={<Login7 />} />
            <Route path="/register/signUp" element={<Signup7 />} />
          </Route>
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
      className="h-screen w-screen flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 bg-white z-[10000px] transition-opacity"
    >
      <div>
        <img
          src={mainLogo}
          alt="Animation logo"
          className="inline-block w-[300px] md:w-[350px]"
        />
      </div>
    </motion.div>
  );
};

export default App;
