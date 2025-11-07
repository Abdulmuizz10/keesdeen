import { Button } from "@relume_io/relume-ui";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import LogOutButton from "../../components/LogOutButton";
import { Pencil, Trash2, CreditCard } from "lucide-react";
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
  const [tab, setTab] = useState<string>("order_history");

  const tabStatus = [
    { text: "Order History", status: "order_history" },
    { text: "Addresses", status: "addresses" },
    ,
    { text: "Saved Cards", status: "saved_cards" },
  ];

  const tabComponents: Record<string, JSX.Element> = {
    order_history: <OrderHistory />,
    addresses: <Addresses />,
    saved_cards: <SavedCards />,
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
                  {user?.firstName}
                </h2>
                <h2 className="text-3xl font-semibold text-text-primary">
                  {user?.lastName}
                </h2>
              </div>
              <p className="text-gray-500 text-xs sm:text-base md:text-lg">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-60">
          <div className="w-full flex justify-center">
            {tabStatus.map((item: any, index) => (
              <Button
                className={`w-full transition-all poppins text-sm sm:text-base md:text-xl px-2 sm:px-0 ${
                  item?.status === tab && "bg-brand-neutral text-white"
                }`}
                key={index}
                onClick={() => setTab(item.status)}
              >
                {item?.text}
              </Button>
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

const OrderHistory = () => {
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  // Fetch data from backend

  return (
    <section className="w-full">
      {loading ? (
        Array.from({ length: 5 }).map((_, index: number) => (
          <div
            key={index}
            className="gap-4 py-10 sm:px-5 border-b border-border-secondary transition-all duration-200"
          >
            {/* Address Details */}
            <div className="space-y-1 text-gray-700">
              <div className="h-6 bg-gray-200 animate-pulse" />
              <div className="h-6 bg-gray-200 animate-pulse" />
              <div className="h-6 bg-gray-200 animate-pulse" />
              <div className="h-6 bg-gray-200 animate-pulse" />
            </div>
          </div>
        ))
      ) : orders.length > 0 ? (
        orders?.map((order: any, index: number) => {
          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-10 sm:px-5 border-b border-border-secondary hover:bg-gray-50 transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-900">{order._id}</p>
                <p className="text-sm text-gray-600">
                  {order.items} {order.items > 1 ? "items" : "item"} •{" "}
                  {new Date(order.paidAt).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-2">
                <span
                  className={`text-sm font-medium ${
                    order.isDelivered === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.isDelivered}
                </span>
                <p className="font-semibold text-gray-900">{order.total}</p>
                <Link
                  to={`/order_details/${order._id}`}
                  className="w-full md:w-auto max-sm:mt-5"
                >
                  <Button className="mt-4 bg-brand-neutral text-white rounded-md py-3 px-10 max-sm:w-full text-base poppins">
                    More details
                  </Button>
                </Link>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 mt-20">
          <p className="text-base sm:text-md text-center text-text-secondary">
            You haven’t placed any orders yet. Start shopping to place your
            first one!
          </p>

          <Link to="/collections/shop_all">
            <Button className="`w-full my-4 sm:w-fit active:bg-brand-neutral/50 bg-brand-neutral text-text-light border-none rounded-md poppins">
              Shop Now
            </Button>
          </Link>
        </div>
      )}

      {/* Pagination */}
      {orders.length > 4 && (
        <div className="flex justify-end mt-30 gap-3 poppins">
          <button
            className={`py-3 px-4 rounded-md bg-brand-neutral text-white ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
            }}
          >
            Previous
          </button>

          <button
            className={`py-3 px-4 rounded-md bg-brand-neutral text-white ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            }}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

const Addresses = () => {
  const [address, setAddress] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  // Fetch data from backend

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

  return (
    <section className="w-full">
      {loading ? (
        Array.from({ length: 5 }).map((_, index: number) => (
          <div
            key={index}
            className="gap-4 py-10 sm:px-5 border-b border-border-secondary transition-all duration-200"
          >
            {/* Address Details */}
            <div className="space-y-1 text-gray-700">
              <div className="h-6 bg-gray-200 animate-pulse" />
              <div className="h-6 bg-gray-200 animate-pulse" />
              <div className="h-6 bg-gray-200 animate-pulse" />
              <div className="h-6 bg-gray-200 animate-pulse" />
            </div>
          </div>
        ))
      ) : address.length > 0 ? (
        address?.map((address: any, index: number) => {
          const { shippingAddress } = address;
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
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-10 sm:px-5 border-b border-border-secondary hover:bg-gray-50 transition-all duration-200"
            >
              {/* Address Details */}
              <div className="space-y-1 text-gray-700">
                <p className="font-semibold text-gray-900">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <p className="text-sm">{shippingAddress.address1}</p>
                {shippingAddress.address2 && (
                  <p className="text-sm">{shippingAddress.address2}</p>
                )}
                <p className="text-sm">
                  {stateName}, {countryName}
                </p>
                <p className="text-sm text-gray-500">{shippingAddress.phone}</p>
              </div>

              {/* Icons */}
              <div className="flex items-center gap-4 sm:gap-6">
                <Link
                  to={`/update-address/${address.id}`}
                  className="text-gray-600 hover:text-black transition"
                  title="Update address"
                >
                  <Pencil size={20} />
                </Link>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="text-gray-600 hover:text-red-600 transition"
                  title="Delete address"
                >
                  <Trash2 size={20} className="text-text-error" />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-base sm:text-xl text-center">
          No Address available.
        </p>
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
