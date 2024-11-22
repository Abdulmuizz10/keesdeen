import { Button } from "@relume_io/relume-ui";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
// import Spinner from "../../components/Spinner";
// import { formatAmount } from "../../lib/utils";
import { useOrders } from "../../context/OrderContext/OrderContext";
import { getProfileOrders } from "../../context/OrderContext/OrderApiCalls";
import LogOutButton from "../../components/LogOutButton";
import { Link } from "react-router-dom";
import { profileLinks } from "../../lib/constants";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isAdmin: Boolean;
}

const Profile: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { orderDispatch } = useOrders();

  const sampleUser: UserProfile = {
    id: user.id,
    name: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  const [updatedUser, setUpdatedUser] = useState<UserProfile>(sampleUser);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(updatedUser.name);

  const handleSave = () => {
    setUpdatedUser({ ...updatedUser, name: editedName });
    setIsEditing(false);
  };

  useEffect(() => {
    getProfileOrders(orderDispatch);
  }, [orderDispatch, user]);

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

          <div className=" space-y-10 mt-20">
            {profileLinks.map((item, index) => (
              <div key={index} className="focus-visible:outline-none">
                <div className="flex flex-col gap-y-6 md:gap-y-8">
                  <div className="grid auto-cols-fr items-center border border-gray-200 rounded-md lg:grid-cols-2">
                    <Link
                      to={item.route}
                      className="relative block aspect-video size-full lg:aspect-auto"
                    >
                      <img
                        src={item.image}
                        alt="Relume placeholder image 1"
                        className="absolute size-full object-cover"
                      />
                      <div className="absolute left-6 top-6 flex items-center bg-background-secondary px-2 py-1 text-sm font-semibold md:left-8 md:top-8"></div>
                    </Link>
                    <div className="p-6 md:p-8">
                      <h2 className="mt-5 text-2xl font-bold md:mt-6 md:text-6xl">
                        {item.title}
                      </h2>

                      <div className="my-5 md:my-7">
                        <p className="mt-2">{item.text}</p>
                      </div>
                      <Link to={item.route}>
                        <Button
                          // className="focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-border-primary text-text-primary bg-background-primary px-6 py-3 mt-5 md:mt-6 w-full"

                          className="bg-brand-neutral text-white rounded-md py-3 px-10 w-full"
                        >
                          View details
                        </Button>
                      </Link>
                    </div>
                  </div>
                  {/* Additional sections follow the same structure */}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full flex justify-end mt-10 lg:mt-14">
            <LogOutButton />
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;
