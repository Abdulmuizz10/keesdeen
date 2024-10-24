import { useContext, useEffect } from "react";
// Libraries
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// import { Navbar2 } from "./pages/admin pages/AdminNavbar";

const App: React.FC = () => {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });

  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="overflow-x-hidden ">
      <ToastContainer />
      {/* <Router>
        <Route
          exact
          path={[
            "/",
            "/shop_all",
            "/new_in",
            "/product_details/:id",
            "/best_sellers/:name",
            "/cart",
            "/wishlists",
            "/profile",
            "/check_out",
          ]}
        >
          <RootLayouts>
            <Navbar7 />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/shop_all" component={ShopAll} />
              <Route exact path="/new_in" component={NewArrivals} />
              <Route
                exact
                path="/product_details/:id"
                component={ProductDetails}
              />
              <Route exact path="/best_sellers/:name" component={BestSellers} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/wishlists" component={WishLists} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/check_out" component={Checkout} />
            </Switch>
            <Footer1 />
          </RootLayouts>
        </Route>
        {user?.isAdmin && (
          <Route
            exact
            path={[
              "/admin",
              "/admin/customers",
              "/admin/products",
              "/admin/orders",
              "/admin/add_product",
              "/admin/dashboard/sales",
              "/admin/dashboard/orders",
            ]}
          >
            <AdminLayout>
            
              <Switch>
                <Route exact path="/admin" component={AdminHome} />
                <Route exact path="/admin/products" component={AdminProducts} />
                <Route exact path="/admin/orders" component={AdminOrders} />
                <Route
                  exact
                  path="/admin/add_product"
                  component={AddProducts}
                />
                <Route
                  exact
                  path="/admin/dashboard/sales"
                  component={AdminDashBoardSales}
                />
                <Route
                  exact
                  path="/admin/dashboard/orders"
                  component={AdminDashBoardOrders}
                />
              </Switch>
            </AdminLayout>
          </Route>
        )}

        <Route exact path={["/register/login", "/register/signUp"]}>
          <AuthLayout>
            <Switch>
              <Route exact path="/register/login" component={Login7} />
              <Route exact path="/register/signUp" component={Signup7} />
            </Switch>
          </AuthLayout>
        </Route>
      </Router> */}
      <Router>
        <Routes>
          {/* Root Layout with common pages */}
          <Route element={<RootLayouts />}>
            <Route path="/" element={<Home />} />
            <Route path="/collections/shop_all" element={<ShopAll />} />
            <Route path="/collections/new_in" element={<NewArrivals />} />
            <Route path="/collections/Active_wear" element={<ActiveWear />} />
            <Route
              path="/collections/Fitness_accessories"
              element={<FitnessAccessories />}
            />
            <Route path="/collections/:name" element={<Collections />} />
            <Route path="/product_details/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlists" element={<WishLists />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/check_out" element={<Checkout />} />
          </Route>

          {/* Admin Routes (Only accessible to admins) */}
          {user?.isAdmin ? (
            <Route element={<AdminLayout />}>
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
            </Route>
          ) : null}

          <Route element={<AdminLayout />}>
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
          </Route>

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

export default App;
