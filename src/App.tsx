import { useEffect } from "react";

// Libraries
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Lenis from "@studio-freight/lenis";

// Layouts
import RootLayouts from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

// Components
import { Navbar7 } from "./components/Navbar";
import { Footer5 } from "./components/Footer";

// Root Pages
import Home from "./pages/root pages/Home";
import ShopAll from "./pages/root pages/ShopAll";

// Auth Pages
import { Login7 } from "./pages/auth pages/Login";
import { Signup7 } from "./pages/auth pages/SignUp";

// Admin Pages
import Chart from "./pages/admin pages/Testimonials";
import NewArrivals from "./pages/root pages/NewArrivals";

// Context

const App: React.FC = () => {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });

  const admin = true;

  return (
    <div className="overflow-x-hidden">
      <Router>
        <Route exact path={["/", "/shop_all", "/new_in"]}>
          <RootLayouts>
            <Navbar7 />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/shop_all" component={ShopAll} />
              <Route exact path="/new_in" component={NewArrivals} />
            </Switch>
            <Footer5 />
          </RootLayouts>
        </Route>
        {admin && (
          <Route exact path={["/admin", "/chart"]}>
            <AdminLayout>
              <Switch>
                <Route exact path="/chart" component={Chart} />
              </Switch>
            </AdminLayout>
          </Route>
        )}

        <Route exact path={["/login", "/signUp"]}>
          <AuthLayout>
            <Switch>
              <Route exact path="/login" component={Login7} />
              <Route exact path="/signUp" component={Signup7} />
            </Switch>
          </AuthLayout>
        </Route>
      </Router>
    </div>
  );
};

export default App;
