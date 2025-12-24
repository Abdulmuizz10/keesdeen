import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import LogOutButton from "../../components/LogOutButton";
import { Trash2, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Country, State } from "country-state-city";
import { toast } from "sonner";
import Axios from "axios";
import { URL } from "../../lib/constants";

interface SavedCard {
  id: string;
  cardBrand: string;
  cardLast4: string;
  cardNumber: string;
  lastUsed: string;
  paymentStatus: string;
}

const Profile: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState<string>("orders");

  const tabStatus = [
    { text: "Orders", status: "orders" },
    { text: "Addresses", status: "addresses" },
    ,
    { text: "Cards", status: "cards" },
  ];

  const tabComponents: Record<string, JSX.Element> = {
    orders: <OrderHistory />,
    addresses: <Addresses />,
    cards: <SavedCards />,
  };

  return (
    <section className="placing">
      <div>
        <div>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            <span>Profile</span>
          </h2>
        </div>
        {/* Profile Section */}
        <div className="pt-5 pb-10">
          <div className="flex flex-col md:flex-row items-center sm:gap-3 lg:gap-5">
            <div className="w-24 h-24 rounded-full border border-gray-500 flex items-center justify-center text-3xl lg:text-4xl">
              {user?.firstName.split("")[0]}
            </div>

            <div className="flex flex-col gap-3 sm:gap-0 mt-3 max-md:items-center">
              <div className="flex items-center sm:gap-2 flex-col md:flex-row">
                <h2 className="text-xl md:text-3xl font-semibold text-text-primary">
                  <span>{user?.firstName}</span>
                </h2>
                <h2 className="text-xl md:text-3xl font-semibold text-text-primary">
                  <span>{user?.lastName}</span>
                </h2>
              </div>
              <p className="text-text-secondary text-sm sm:text-base">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-60">
          <div className="w-full flex justify-center">
            {tabStatus.map((item: any, index) => (
              <div
                className={`cursor-pointer py-4 w-full transition-all flex items-center justify-center poppins text-xs uppercase tracking-wider px-2 sm:px-0 ${
                  item?.status === tab
                    ? "border-b-2 border-gray-700"
                    : "border-b border-gray-300 text-text-secondary"
                }`}
                key={index}
                onClick={() => setTab(item.status)}
              >
                {item?.text}
              </div>
            ))}
          </div>
          <div className="mt-10">{tabComponents[tab]}</div>
        </div>

        <div className="w-full flex justify-end">
          <LogOutButton />
        </div>
      </div>
    </section>
  );
};

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(
        `${URL}/orders/profile/pagination-orders?page=${page}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      toast.error("Error fetching orders. Please refresh the page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "Shipped":
        return "text-blue-600";
      case "Pending":
        return "text-amber-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="space-y-8">
          {Array.from({ length: 5 }).map((_, index: number) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-8 animate-pulse"
            >
              <div className="h-4 bg-gray-200 w-1/4 mb-4" />
              <div className="h-3 bg-gray-200 w-1/3 mb-2" />
              <div className="flex my-5 items-center gap-2">
                {Array.from({ length: 4 }).map((_, index: number) => (
                  <div className="h-20 w-20 bg-gray-200" key={index} />
                ))}
              </div>
              <div className="h-3 bg-gray-200 w-1/6" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
      {orders.length > 0 ? (
        <>
          {/* Orders List */}
          <div className="space-y-12">
            {orders.map((order: any, index: number) => (
              <div
                key={index}
                className="group border-b border-gray-100 pb-12 last:border-0 transition-opacity hover:opacity-70"
              >
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="mb-2 font-light tracking-tight md:hidden">
                      Order - {order._id.slice(-8).toUpperCase()}
                    </h2>
                    <h2 className="mb-2 font-light tracking-tight hidden md:block">
                      Order - {order._id.toUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.paidAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span
                      className={`text-xs font-medium uppercase tracking-wider ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <p className="text-sm font-light">{order.total}</p>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.orderedItems && order.orderedItems.length > 0 && (
                  <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
                    {order.orderedItems
                      .slice(0, 3)
                      .map((item: any, i: number) => (
                        <div
                          key={i}
                          className="h-20 w-20 flex-shrink-0 overflow-hidden bg-gray-50"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={"Product"}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    {order.orderedItems.length > 3 && (
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center bg-gray-50 text-xs text-gray-500">
                        +{order.orderedItems.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <Link
                  to={`/order_details/${order._id}`}
                  className="inline-block border-b border-gray-900 pb-1 text-sm uppercase tracking-widest transition-colors hover:border-gray-400 hover:text-gray-400"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-between border-t border-gray-200 pt-8">
              <button
                className={`text-sm uppercase tracking-widest transition-colors ${
                  currentPage === 1
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-900 hover:text-gray-400"
                }`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>

              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className={`text-sm uppercase tracking-widest transition-colors ${
                  currentPage === totalPages
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-900 hover:text-gray-400"
                }`}
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="flex min-h-[40vh] flex-col items-center justify-center">
          <p className="mb-8 text-center text-sm uppercase tracking-widest text-gray-400">
            No orders yet
          </p>
          <Link
            to="/collections/shop_all"
            className="border-b border-gray-900 pb-1 text-sm uppercase tracking-widest transition-colors hover:border-gray-400 hover:text-gray-400"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </section>
  );
};

const Addresses: React.FC = () => {
  const [address, setAddress] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(`${URL}/address/get-address`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setAddress(response.data);
      }
    } catch (error) {
      toast.error("Error fetching address. Please refresh the page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (confirmDelete) {
      setLoading(true);
      try {
        const response = await Axios.delete(
          `${URL}/address/${id}/delete-address`,
          {
            withCredentials: true,
            validateStatus: (status: any) => status < 600,
          }
        );
        if (response.status === 200) {
          fetchData();
          toast.success(response.data.message);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          toast.error(response.data.message || "Something went wrong");
        }
      } catch (err) {
        toast.error("Address can't be deleted!");
      }
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, index: number) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-8 animate-pulse"
            >
              <div className="h-4 bg-gray-200 w-1/4 mb-3" />
              <div className="h-3 bg-gray-200 w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 w-1/6" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
      {address.length > 0 ? (
        <div className="space-y-12">
          {address.map((addr: any, index: number) => {
            const { shippingAddress } = addr;
            const countryName =
              Country.getCountryByCode(shippingAddress.country)?.name ||
              shippingAddress.country;
            const stateName =
              State.getStateByCodeAndCountry(
                shippingAddress.state,
                shippingAddress.country
              )?.name || shippingAddress.state;

            return (
              <div
                key={index}
                className="group flex items-start justify-between border-b border-gray-100 pb-12 transition-opacity hover:opacity-70"
              >
                {/* Address Details */}
                <div className="space-y-1 text-sm leading-relaxed">
                  <p className="font-light text-gray-900">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">{shippingAddress.address1}</p>
                  {shippingAddress.address2 && (
                    <p className="text-gray-600">{shippingAddress.address2}</p>
                  )}
                  <p className="text-gray-600">
                    {stateName}, {countryName}
                  </p>
                  <p className="text-gray-600">{shippingAddress.postalCode}</p>
                  <p className="pt-2 text-gray-600">+{shippingAddress.phone}</p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="text-gray-400 transition-colors hover:text-red-600"
                  title="Delete address"
                  aria-label="Delete address"
                >
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex min-h-[40vh] flex-col items-center justify-center">
          <p className="text-center text-sm uppercase tracking-widest text-gray-400">
            No saved addresses
          </p>
        </div>
      )}
    </section>
  );
};

const SavedCards = () => {
  const { user } = useContext(AuthContext);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const response = await Axios.get(`${URL}/users/saved-cards`, {
          withCredentials: true,
        });
        if (response.data.success) setCards(response.data.cards);
      } catch {
        toast.error("Failed to load saved cards");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSavedCards();
  }, [user]);

  const getCardGradient = (brand: string): string => {
    const gradients: Record<string, string> = {
      VISA: "from-[#1A1F71]/90 via-[#1434CB]/80 to-[#0F4C81]",
      MASTERCARD: "from-[#EB001B]/90 via-[#F79E1B]/80 to-[#D97706]",
      AMERICAN_EXPRESS: "from-[#006FCF]/90 via-[#00A3E0]/80 to-[#0284C7]",
      AMEX: "from-[#006FCF]/90 via-[#00A3E0]/80 to-[#0284C7]",
      DISCOVER: "from-[#FF6000]/90 via-[#FFA500]/80 to-[#F97316]",
      UNKNOWN: "from-[#111827] via-[#1F2937] to-[#020617]",
    };
    return gradients[brand] || gradients.UNKNOWN;
  };

  const getCardLogo = (brand: string): string => {
    const logos: Record<string, string> = {
      VISA: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg",
      MASTERCARD:
        "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mastercard.svg",
      AMERICAN_EXPRESS:
        "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/americanexpress.svg",
      AMEX: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/americanexpress.svg",
      DISCOVER:
        "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discover.svg",
    };
    return logos[brand] || "";
  };

  const formatBrandName = (brand: string) =>
    ((
      {
        VISA: "Visa",
        MASTERCARD: "Mastercard",
        AMEX: "Amex",
        AMERICAN_EXPRESS: "American Express",
        DISCOVER: "Discover",
      } as any
    )[brand] || "Card");

  const formatLastUsed = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <section className="w-full">
      {cards.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group relative min-h-[200px] rounded-2xl p-5 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {/* Background */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getCardGradient(
                  card.cardBrand
                )}`}
              />

              {/* Glass overlay */}
              <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm" />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-between">
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/70">
                      Payment Card
                    </p>
                    <p className="text-sm font-semibold">
                      {formatBrandName(card.cardBrand)}
                    </p>
                  </div>

                  {getCardLogo(card.cardBrand) ? (
                    <img
                      src={getCardLogo(card.cardBrand)}
                      alt={card.cardBrand}
                      className="h-7 w-auto opacity-90 brightness-0 invert"
                    />
                  ) : (
                    <CreditCard className="h-6 w-6 opacity-80" />
                  )}
                </div>

                {/* Card Number */}
                <div className="mt-4 mb-3">
                  <p className="tracking-widest text-base">{card.cardNumber}</p>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/60">
                      Last Used
                    </p>
                    <p className="text-xs font-medium">
                      {formatLastUsed(card.lastUsed)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        card.paymentStatus === "COMPLETED"
                          ? "bg-emerald-400"
                          : "bg-white/50"
                      }`}
                    />
                    {card.paymentStatus === "COMPLETED" ? "Active" : "Used"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No saved cards found</p>
          <p className="mt-2 text-sm text-gray-400">
            Cards from previous payments will appear here
          </p>
        </div>
      )}
    </section>
  );
};

export default Profile;
