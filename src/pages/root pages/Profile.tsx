import { Button } from "@relume_io/relume-ui";
import { useState } from "react";

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
  const sampleUser: UserProfile = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    orders: [
      {
        id: 1,
        date: "2024-09-15",
        total: 150.5,
        items: ["T-shirt", "Jeans"],
      },
      { id: 2, date: "2024-08-22", total: 90.0, items: ["Shoes", "Socks"] },
    ],
  };

  const [user, setUser] = useState<UserProfile>(sampleUser);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(user.name);
  const [editedEmail, setEditedEmail] = useState<string>(user.email);

  const handleSave = () => {
    setUser({ ...user, name: editedName, email: editedEmail });
    setIsEditing(false);
  };

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-10">
      <div className="container">
        {/* <div className="max-w-2xl mx-auto my-10 p-5 border rounded-lg shadow-lg bg-white"> */}
        {/* Profile Section */}
        <div className="max-sm:flex-col flex max-sm:items-start items-center justify-between max-sm:space-y-5">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full border"
            />
            {isEditing ? (
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  className="border px-2 py-1 rounded"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <input
                  type="email"
                  className="border px-2 py-1 rounded"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            )}
          </div>

          <Button
            className="rounded-md md:w-56"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "Save" : "Edit Profile"}
          </Button>
        </div>

        {/* Order History Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Order History</h3>
          <ul className="space-y-4">
            {user.orders.map((order) => (
              <li
                key={order.id}
                className="border p-4 rounded-lg shadow-sm flex justify-between"
              >
                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Order ID:</span> #{order.id}
                  </p>
                  <p className="text-gray-500">
                    <span className="font-semibold">Date:</span> {order.date}
                  </p>
                  <p className="text-gray-500">
                    <span className="font-semibold">Items:</span>{" "}
                    {order.items.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Profile;
