import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { mainLogo, mainLogoWhite } from "../assets";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  X,
  Menu,
  Shield,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { useShop } from "../context/ShopContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { getCartCount, wishLists, isActive, setIsActive } = useShop();

  // Check if we're on home page
  const isHomePage = location.pathname === "/";

  // Handle scroll effect for background

  useEffect(() => {
    // If not on home page, always set scrolled to true
    if (!isHomePage) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {isHomePage ? (
        <nav
          className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
            isScrolled ? "bg-white shadow-xxsmall py-4" : "bg-transparent py-4"
          }`}
        >
          <div className="mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between lg:grid lg:grid-cols-3">
              {/* Logo - Left */}
              <div className="flex items-start">
                <Link to="/">
                  <img
                    src={isScrolled ? mainLogo : mainLogoWhite}
                    alt="Logo"
                    // className="h-8 w-auto sm:h-10 lg:h-8 xl:h-10"
                    className="h-8 md:h-10 w-full"
                  />
                </Link>
              </div>

              {/* Nav Links - Center (Desktop Only) */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="flex items-center gap-4 text-sm tracking-wider font-light">
                  <Link
                    to="/collections/shop_all"
                    className={`hover:text-text-secondary transition-colors duration-200 ${
                      isScrolled ? "text-text-primary" : "text-white"
                    }`}
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    All
                  </Link>
                  <Link
                    to="/collections/new_arrivals"
                    className={`hover:text-text-secondary transition-colors duration-200 ${
                      isScrolled ? "text-text-primary" : "text-white"
                    }`}
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    New Arrivals
                  </Link>
                  <Link
                    to="/collections/active_wears"
                    className={`hover:text-text-secondary transition-colors duration-200 ${
                      isScrolled ? "text-text-primary" : "text-white"
                    }`}
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    Active Wears
                  </Link>
                  <Link
                    to="/collections/fitness_accessories"
                    className={`hover:text-text-secondary transition-colors duration-200 ${
                      isScrolled ? "text-text-primary" : "text-white"
                    }`}
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    Fitness Accessories
                  </Link>
                </div>
              </div>

              {/* Icons - Right */}
              <div className="flex items-center justify-end gap-4">
                {/* Desktop Icons */}
                <div className="hidden sm:flex items-center gap-4">
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    aria-label="Search"
                  >
                    <Search
                      className={`w-5 h-5 ${
                        isScrolled
                          ? "text-text-primary"
                          : "text-white hover:text-text-primary"
                      }`}
                    />
                  </button>

                  <Link
                    to="/cart"
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    <ShoppingBag
                      className={`w-5 h-5 ${
                        isScrolled
                          ? "text-text-primary"
                          : "text-white hover:text-text-primary"
                      }`}
                    />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                        {getCartCount()}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/wishlists"
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isScrolled
                          ? "text-text-primary"
                          : "text-white hover:text-text-primary"
                      }`}
                    />
                    {wishLists.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                        {wishLists.length}
                      </span>
                    )}
                  </Link>

                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 border-2 ${
                        isScrolled ? "border-gray-700" : "border-white"
                      }`}
                      title="Admin Dashboard"
                    >
                      <Shield
                        className={`w-5 h-5 ${
                          isScrolled
                            ? "text-text-primary"
                            : "text-white hover:text-text-primary"
                        }`}
                      />
                    </Link>
                  )}

                  {user ? (
                    <Link
                      to="/profile"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <User
                        className={`w-5 h-5 ${
                          isScrolled
                            ? "text-text-primary"
                            : "text-white hover:text-text-primary"
                        }`}
                      />
                    </Link>
                  ) : (
                    <Link
                      to="/auth/sign_in"
                      className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-full transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                  )}
                </div>

                {/* Mobile Icons */}
                <div className="flex sm:hidden items-center gap-3">
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className="p-2"
                    aria-label="Search"
                  >
                    <Search
                      className={`w-5 h-5 ${
                        isScrolled ? "text-text-primary" : "text-white"
                      }`}
                    />
                  </button>

                  <Link
                    to="/cart"
                    className="relative p-2"
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    <ShoppingBag
                      className={`w-5 h-5 ${
                        isScrolled ? "text-text-primary" : "text-white"
                      }`}
                    />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                        {getCartCount()}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X
                      className={`w-5 h-5 ${
                        isScrolled ? "text-text-primary" : "text-white"
                      }`}
                    />
                  ) : (
                    <Menu
                      className={`w-5 h-5 ${
                        isScrolled ? "text-text-primary" : "text-white"
                      }`}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="fixed top-0 inset-x-0 z-40 bg-white shadow-xxsmall py-4">
          <div className="mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between lg:grid lg:grid-cols-3">
              {/* Logo - Left */}
              <div className="flex items-start">
                <Link to="/">
                  <img
                    src={mainLogo}
                    alt="Logo"
                    className="h-8 md:h-10 w-full"
                  />
                </Link>
              </div>

              {/* Nav Links - Center (Desktop Only) */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="flex items-center gap-4 text-sm tracking-wider font-light">
                  <Link
                    to="/collections/shop_all"
                    className="text-text-primary hover:text-text-secondary transition-colors duration-200"
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    All
                  </Link>
                  <Link
                    to="/collections/new_arrivals"
                    className="text-text-primary hover:text-text-secondary transition-colors duration-200"
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    New Arrivals
                  </Link>
                  <Link
                    to="/collections/active_wears"
                    className="text-text-primary hover:text-text-secondary transition-colors duration-200"
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    Active Wears
                  </Link>
                  <Link
                    to="/collections/fitness_accessories"
                    className="text-text-primary hover:text-text-secondary transition-colors duration-200"
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    Fitness Accessories
                  </Link>
                </div>
              </div>

              {/* Icons - Right */}
              <div className="flex items-center justify-end gap-4">
                {/* Desktop Icons */}
                <div className="hidden sm:flex items-center gap-4">
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 text-gray-700" />
                  </button>

                  <Link
                    to="/cart"
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    <ShoppingBag className="w-5 h-5 text-gray-700" />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                        {getCartCount()}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/wishlists"
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    <Heart className="w-5 h-5 text-gray-700" />
                    {wishLists.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                        {wishLists.length}
                      </span>
                    )}
                  </Link>

                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 border-2 border-gray-700"
                      title="Admin Dashboard"
                    >
                      <Shield className="w-5 h-5 text-gray-700" />
                    </Link>
                  )}

                  {user ? (
                    <Link
                      to="/profile"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <User className="w-5 h-5 text-gray-700" />
                    </Link>
                  ) : (
                    <Link
                      to="/auth/sign_in"
                      className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-full transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                  )}
                </div>

                {/* Mobile Icons */}
                <div className="flex sm:hidden items-center gap-3">
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className="p-2"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 text-gray-700" />
                  </button>

                  <Link
                    to="/cart"
                    className="relative p-2"
                    onClick={() => {
                      if (isActive) setIsActive(false);
                    }}
                  >
                    <ShoppingBag className="w-5 h-5 text-gray-700" />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                        {getCartCount()}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Navigation */}
      <MobileNavbar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        wishListCount={wishLists.length}
        isActive={isActive}
        setIsActive={setIsActive}
      />
    </>
  );
};

// Mobile Navbar Component
interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  wishListCount: number;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
}

const MobileNavbar = ({
  isOpen,
  onClose,
  user,
  wishListCount,
  isActive,
  setIsActive,
}: MobileNavbarProps) => {
  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <X
            className="w-7 h-7 text-text-primary absolute top-7 right-7"
            onClick={onClose}
          />
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-6 mt-10">
            <div className="space-y-1">
              <Link
                to="/"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-colors"
                onClick={() => {
                  onClose();
                  if (isActive) setIsActive(false);
                }}
              >
                Home
              </Link>
              <Link
                to="/collections/shop_all"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-colors"
                onClick={() => {
                  onClose();
                  if (isActive) setIsActive(false);
                }}
              >
                Shop All
              </Link>
              <Link
                to="/collections/new_arrivals"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-colors"
                onClick={() => {
                  onClose();
                  if (isActive) setIsActive(false);
                }}
              >
                New Arrivals
              </Link>
              <Link
                to="/collections/active_wears"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-colors"
                onClick={() => {
                  onClose();
                  if (isActive) setIsActive(false);
                }}
              >
                Active Wears
              </Link>
              <Link
                to="/collections/fitness_accessories"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-colors"
                onClick={() => {
                  onClose();
                  if (isActive) setIsActive(false);
                }}
              >
                Fitness Accessories
              </Link>
            </div>

            {/* Divider */}
            <div className="my-6 border-t" />

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link
                to="/wishlists"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => {
                  onClose();
                  if (isActive) setIsActive(false);
                }}
              >
                <span className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </span>
                {wishListCount > 0 && (
                  <span className="bg-black text-white text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center">
                    {wishListCount}
                  </span>
                )}
              </Link>

              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <Shield className="w-5 h-5" />
                  Admin Dashboard
                </Link>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={onClose}
              >
                <User className="w-5 h-5" />
                My Account
              </Link>
            ) : (
              <Link
                to="/auth/sign_in"
                className="block w-full px-4 py-3 text-center text-base font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
                onClick={onClose}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
