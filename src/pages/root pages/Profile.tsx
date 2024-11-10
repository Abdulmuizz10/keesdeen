import { Button } from "@relume_io/relume-ui";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Logout } from "../../context/AuthContext/AuthActions";
import { useShop } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { formatAmount } from "../../lib/utils";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isAdmin: Boolean;
}

const Profile: React.FC = () => {
  const { user, dispatch } = useContext(AuthContext);
  const { setWishLists, setCartItems, orderHistory } = useShop();

  const sampleUser: UserProfile = {
    id: user.id,
    name: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
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
    setCartItems({});
    navigate("/");
  };

  return (
    <section id="profile" className="px-[5%] py-24 md:py-30">
      {updatedUser && (
        <div className="container">
          <div className="rb-12 mb-12 md:mb-5">
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
              Profile
            </h2>
          </div>

          {/* Profile Section */}
          <div className="py-2">
            <div className="flex flex-col md:flex-row items-center gap-6">
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
              {orderHistory ? (
                orderHistory.length > 0 ? (
                  orderHistory.map((order: any) => (
                    <div
                      key={order.id}
                      className="py-4 border-b border-border-secondary sm:grid sm:grid-cols-[4fr_1fr] flex flex-col sm:items-center "
                    >
                      <div className="flex flex-col gap-2">
                        <p className="text-text-primary font-medium">
                          Order ID: #{order._id}
                        </p>
                        <div className="text-gray-500 text-end">
                          <div className="flex gap-2 items-center">
                            <p className="text-sm text-gray-500 ">
                              {order?.paidAt?.split("").slice(0, 10)}
                            </p>
                            <p className="text-sm text-gray-500 ">
                              {order?.paidAt?.split("").slice(11, 19)}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <p className="text-text-primary font-medium">
                            Items:
                          </p>
                          <div className="flex items-center gap-2">
                            {order.orderedItems.map((i: any, index: number) => (
                              <p className="text-brand-neutral" key={index}>
                                {i.name},
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="sm:text-end text-start max-sm:mt-3">
                        <div className="flex items-center sm:justify-end justify-start gap-2">
                          <p className="font-semibold text-text-primary">
                            Total:
                          </p>
                          <p className="font-semibold text-gray-500">
                            {formatAmount(order.totalPrice)}
                          </p>
                        </div>
                        <div className="flex items-center sm:justify-end justify-start gap-2">
                          <p className="font-semibold text-text-primary">
                            Status:
                          </p>
                          <p className="font-semibold text-gray-500">
                            {order.isDelivered === false
                              ? "Pending"
                              : "Processed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No order history available.
                  </p>
                )
              ) : (
                <div className="w-full flex justify-center">
                  <Spinner />
                </div>
              )}
            </div>

            <div className="w-full flex justify-end mt-10 lg:mt-14">
              <Button
                className="bg-brand-neutral text-white rounded-md py-3 px-10 max-sm:w-full"
                onClick={() => handleLogout()}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;
