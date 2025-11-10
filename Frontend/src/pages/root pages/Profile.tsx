import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import LogOutButton from "../../components/LogOutButton";
import { Trash2, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Country, State } from "country-state-city";
import { toast } from "sonner";
import Axios from "axios";
import { URL } from "../../lib/constants";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isAdmin: Boolean;
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
            <div className="w-24 h-24 rounded-full border bg-brand-neutral flex items-center justify-center text-text-light text-3xl lg:text-4xl">
              {user?.firstName.split("")[0]}
            </div>

            <div className="flex flex-col max-md:items-center">
              <div className="flex items-center sm:gap-2 flex-col md:flex-row">
                <h2 className="text-3xl font-semibold text-text-primary">
                  <span>{user?.firstName}</span>
                </h2>
                <h2 className="text-3xl font-semibold text-text-primary">
                  <span>{user?.lastName}</span>
                </h2>
              </div>
              <p className="text-text-secondary text-xs sm:text-base">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-60">
          <div className="w-full flex justify-center">
            {tabStatus.map((item: any, index) => (
              <div
                className={`cursor-pointer py-4 w-full transition-all flex items-center justify-center poppins text-xs sm:text-base px-2 sm:px-0 ${
                  item?.status === tab
                    ? "border-b-2 border-border-primary"
                    : "border-b"
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
        <div className="mb-16">
          <h1 className="text-2xl font-light tracking-tight md:text-3xl">
            Order History
          </h1>
        </div>
        <div className="space-y-8">
          {Array.from({ length: 5 }).map((_, index: number) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-8 animate-pulse"
            >
              <div className="h-4 bg-gray-200 w-1/4 mb-4" />
              <div className="h-3 bg-gray-200 w-1/3 mb-2" />
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
                    <h2 className="mb-2 font-light tracking-tight">
                      Order - {order._id.slice(-8).toUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.paidAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span
                      className={`text-xs font-medium uppercase tracking-wider ${getStatusColor(
                        order.isDelivered
                      )}`}
                    >
                      {order.isDelivered}
                    </span>
                    <p className="text-sm font-light">{order.total}</p>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.orderedItems && order.orderedItems.length > 0 && (
                  <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
                    {order.orderedItems
                      .slice(0, 4)
                      .map((item: any, i: number) => (
                        <div
                          key={i}
                          className="h-20 w-20 flex-shrink-0 overflow-hidden bg-gray-50"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name || "Product"}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    {order.orderedItems.length > 4 && (
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center bg-gray-50 text-xs text-gray-500">
                        +{order.orderedItems.length - 4}
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
  const [cards, setCards] = useState<
    {
      id: string;
      bank: string;
      cardType: string;
      cardNumber: string;
      expiry: string;
      holderName: string;
      bg: string;
    }[]
  >([]);

  useEffect(() => {
    const fakeCards = [
      {
        id: "card-001",
        bank: "Zenith Bank",
        cardType: "Visa",
        cardNumber: "**** **** **** 4821",
        expiry: "09/27",
        holderName: "Abdul Muizz",
        bg: "from-[#0D324D] to-[#7F5A83]",
      },
      {
        id: "card-002",
        bank: "GTBank",
        cardType: "Mastercard",
        cardNumber: "**** **** **** 9374",
        expiry: "02/28",
        holderName: "Harris Muizz",
        bg: "from-[#1E3C72] to-[#2A5298]",
      },
      {
        id: "card-003",
        bank: "Access Bank",
        cardType: "Verve",
        cardNumber: "**** **** **** 6219",
        expiry: "11/26",
        holderName: "Abdulrahman H.",
        bg: "from-[#1F1C2C] to-[#928DAB]",
      },
      {
        id: "card-004",
        bank: "First Bank",
        cardType: "Visa",
        cardNumber: "**** **** **** 5503",
        expiry: "05/29",
        holderName: "Muizz NG",
        bg: "from-[#2b5876] to-[#4e4376]",
      },
    ];

    setCards(fakeCards);
  }, []);

  const handleDeleteCard = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this card?"
    );
    if (!confirmDelete) return;
    const updated = cards.filter((card) => card.id !== id);
    setCards(updated);
    toast.success("Card deleted successfully!");
  };

  return (
    <section className="w-full">
      {cards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative rounded-2xl p-6 text-white bg-gradient-to-br ${card.bg} shadow-lg hover:scale-[1.02] transition-transform duration-300`}
            >
              {/* Card Top */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">{card.bank}</p>
                  <p className="font-semibold tracking-wide">{card.cardType}</p>
                </div>
                <CreditCard size={28} className="opacity-80" />
              </div>

              {/* Card Number */}
              <div className="mt-10 mb-6">
                <p className="tracking-widest text-lg font-mono">
                  {card.cardNumber}
                </p>
              </div>

              {/* Card Bottom */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase opacity-70">Card Holder</p>
                  <p className="font-semibold text-sm">{card.holderName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase opacity-70">Expires</p>
                  <p className="font-semibold text-sm">{card.expiry}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-3">
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition"
                  title="Delete Card"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No saved cards found.</p>
      )}
    </section>
  );
};

export default Profile;
