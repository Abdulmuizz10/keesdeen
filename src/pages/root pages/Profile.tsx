import { Button } from "@relume_io/relume-ui";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Logout } from "../../context/AuthContext/AuthActions";
import { useShop } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";

// src/types/User.ts
export interface Order {
  id: number;
  date: string;
  total: number;
  items: string[];
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  orders: Order[];
}

const Profile: React.FC = () => {
  const { user, dispatch } = useContext(AuthContext);
  const { setWishLists, setCartItems } = useShop();

  const sampleUser: UserProfile = {
    id: 1,
    name: user.username,
    email: user.email,
    avatar: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    orders: [
      {
        id: 1,
        date: "2024-09-15",
        total: 150.5,
        items: ["T-shirt", "Jeans"],
      },
      {
        id: 2,
        date: "2024-08-22",
        total: 90.0,
        items: ["Shoes", "Socks"],
      },
      {
        id: 3,
        date: "2024-10-01",
        total: 45.75,
        items: ["Cap", "Scarf"],
      },
      {
        id: 4,
        date: "2024-10-05",
        total: 210.0,
        items: ["Jacket", "Sweater", "Gloves"],
      },
      {
        id: 5,
        date: "2024-10-09",
        total: 65.99,
        items: ["Hat", "Belt"],
      },
    ],
  };

  const [updatedUser, setUpdatedUser] = useState<UserProfile>(sampleUser);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(updatedUser.name);
  const navigate = useNavigate();
  const handleSave = () => {
    setUpdatedUser({ ...updatedUser, name: editedName });
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(Logout());
    setWishLists([]);
    setCartItems([]);
    navigate("/");
  };

  return (
    <section id="profile" className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
            Profile
          </h2>
        </div>

        {/* Profile Section */}
        <div className="py-2">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* <img
              src={updatedUser.avatar}
              alt={updatedUser.name}
              className="w-24 h-24 rounded-full border shadow-lg"
            /> */}
            <div className="w-24 h-24 rounded-full border shadow-lg bg-brand-neutral flex items-center justify-center text-text-light text-3xl lg:text-4xl">
              {user.username.split("")[0]}
            </div>
            {isEditing ? (
              <div className="grid grid-cols-1 gap-4 md:flex-1 md:grid-cols-2 w-full">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-sm text-gray-500">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="border border-border-secondary px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-neutral focus:border-transparent"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col max-md:items-center">
                <h2 className="text-2xl font-semibold text-text-primary">
                  {updatedUser.name}
                </h2>
                <p className="text-gray-500">{updatedUser.email}</p>
              </div>
            )}

            <Button
              className="rounded-md bg-brand-neutral text-text-light poppins md:ml-auto max-md:w-full py-[10px]"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? "Save" : "Edit Profile"}
            </Button>
          </div>
        </div>

        {/* Order History Section */}
        <div className="mt-12 border-t border-border-secondary">
          <h3 className="text-3xl font-semibold mt-8 mb-4 text-text-primary">
            Order History
          </h3>
          <div className="space-y-4">
            {updatedUser.orders.map((order) => (
              <div
                key={order.id}
                className="py-4 border-b border-border-secondary grid grid-cols-[4fr_1fr] items-center"
              >
                <div>
                  <p className="text-text-primary font-medium">
                    Order ID: #{order.id}
                  </p>
                  <p className="text-gray-500">Date: {order.date}</p>
                  <p className="text-gray-500">
                    Items: {order.items.join(", ")}
                  </p>
                </div>
                <div className="text-end">
                  <p className="font-semibold text-text-primary">
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full flex justify-end sm:mt-10 lg:mt-14">
            <Button
              className="bg-brand-neutral text-white rounded-md py-3 px-10"
              onClick={() => handleLogout()}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
