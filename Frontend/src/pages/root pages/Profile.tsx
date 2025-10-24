import { Button } from "@relume_io/relume-ui";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import LogOutButton from "../../components/LogOutButton";
import { useShop } from "../../context/ShopContext";
import { Pencil, Trash2, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Country, State } from "country-state-city";
import { toast } from "sonner";

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
    <section id="profile" className="px-[5%] py-24 md:py-30">
      <div>
        <div>
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Profile
          </h2>
        </div>
        {/* Profile Section */}
        <div className="pt-5 pb-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
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

        <div>
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

        <div className="w-full flex justify-end mt-10 lg:mt-14">
          <LogOutButton />
        </div>
      </div>
    </section>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState<
    { id: string; date: string; total: string; status: string; items: number }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust this

  useEffect(() => {
    const fakeOrders = [
      {
        id: "ORD-001",
        date: "2025-10-10",
        total: "$249.99",
        status: "Delivered",
        items: 3,
      },
      {
        id: "ORD-002",
        date: "2025-09-27",
        total: "$89.50",
        status: "In Transit",
        items: 1,
      },
      {
        id: "ORD-003",
        date: "2025-08-15",
        total: "$129.00",
        status: "Cancelled",
        items: 2,
      },
      {
        id: "ORD-004",
        date: "2025-07-20",
        total: "$179.99",
        status: "Delivered",
        items: 4,
      },
      {
        id: "ORD-005",
        date: "2025-06-11",
        total: "$59.99",
        status: "Delivered",
        items: 1,
      },
      {
        id: "ORD-005",
        date: "2025-06-11",
        total: "$59.99",
        status: "Delivered",
        items: 6,
      },
      {
        id: "ORD-005",
        date: "2025-06-11",
        total: "$59.99",
        status: "Delivered",
        items: 3,
      },
    ];

    setOrders(fakeOrders);
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full">
      <div>
        {currentOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-10 sm:px-5 border-b border-border-secondary hover:bg-gray-50 transition-all duration-200"
          >
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-600">
                {order.items} {order.items > 1 ? "items" : "item"} •{" "}
                {order.date}
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-2">
              <span
                className={`text-sm font-medium ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : order.status === "Cancelled"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </span>
              <p className="font-semibold text-gray-900">{order.total}</p>
              <Button className="mt-4 bg-brand-neutral text-white rounded-md py-3 px-10 max-sm:w-full text-base poppins">
                More details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No order history available.
        </p>
      )}

      {/* Pagination Controls */}
      {orders.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 rounded-md"
          >
            Prev
          </Button>

          <span className="text-sm font-medium text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 rounded-md"
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
};

const Addresses = () => {
  const { savedAddresses, setSavedAddresses } = useShop();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Pagination logic
  const totalPages = Math.ceil(savedAddresses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAddresses = savedAddresses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Delete function
  const handleDeleteAddress = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (!confirmed) return;
    const updatedAddresses = savedAddresses.filter(
      (addr: any) => addr.id !== id
    );
    setSavedAddresses(updatedAddresses);
    toast.success("Address deleted successfully!");
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full">
      {currentAddresses.length > 0 ? (
        <div>
          {currentAddresses.map((address: any) => {
            const { deliveryAddress } = address;
            const countryName =
              Country.getCountryByCode(deliveryAddress.country)?.name ||
              deliveryAddress.country;
            const stateName =
              State.getStateByCodeAndCountry(
                deliveryAddress.state,
                deliveryAddress.country
              )?.name || deliveryAddress.state;
            return (
              <div
                key={address.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-10 sm:px-5 border-b border-border-secondary hover:bg-gray-50 transition-all duration-200"
              >
                {/* Address Details */}
                <div className="space-y-1 text-gray-700">
                  <p className="font-semibold text-gray-900">
                    {deliveryAddress.firstName} {deliveryAddress.lastName}
                  </p>
                  <p className="text-sm">{deliveryAddress.address1}</p>
                  {deliveryAddress.address2 && (
                    <p className="text-sm">{deliveryAddress.address2}</p>
                  )}
                  <p className="text-sm">
                    {stateName}, {countryName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {deliveryAddress.phone}
                  </p>
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
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-gray-600 hover:text-red-600 transition"
                    title="Delete address"
                  >
                    <Trash2 size={20} className="text-text-error" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No saved addresses found.</p>
      )}

      {/* Pagination */}
      {savedAddresses.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 rounded-md"
          >
            Prev
          </Button>

          <span className="text-sm font-medium text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 rounded-md"
          >
            Next
          </Button>
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
