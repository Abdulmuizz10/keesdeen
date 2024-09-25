import { useContext, useEffect } from "react";

// Libraries
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import RootLayouts from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

// Components
import { Navbar7 } from "./components/Navbar";
import { Footer1 } from "./components/Footer";

// Root Pages
import Home from "./pages/root pages/Home";
import ShopAll from "./pages/root pages/ShopAll";
import ProductDetails from "./pages/root pages/ProductDetails";
import BestSellers from "./pages/root pages/BestSellers";
import Cart from "./pages/root pages/Cart";
import Checkout from "./pages/root pages/CheckOut";

// Auth Pages
import { Login7 } from "./pages/auth pages/Login";
import { Signup7 } from "./pages/auth pages/SignUp";

// Admin Pages
import Chart from "./pages/admin pages/Testimonials";
import NewArrivals from "./pages/root pages/NewArrivals";

// Context
import { AuthContext } from "./context/AuthContext/AuthContext";
import Profile from "./pages/root pages/Profile";

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
    <div className="overflow-x-hidden">
      <ToastContainer />
      <Router>
        <Route
          exact
          path={[
            "/",
            "/shop_all",
            "/new_in",
            "/product_details/:id",
            "/best_sellers/:name",
            "/cart",
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
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/check_out" component={Checkout} />
            </Switch>
            <Footer1 />
          </RootLayouts>
        </Route>
        {user?.isAdmin && (
          <Route exact path={["/admin", "/price", "/buy"]}>
            <AdminLayout>
              <Switch>
                <Route exact path="/admin" component={Chart} />
                <Route exact path="/price" component={Chart} />
                <Route exact path="/buy" component={Chart} />
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
      </Router>
    </div>
  );
};

export default App;
