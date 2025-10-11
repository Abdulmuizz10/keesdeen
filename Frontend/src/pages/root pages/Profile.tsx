import { Button } from "@relume_io/relume-ui";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
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

  return (
    <section id="profile" className="px-[5%] py-24 md:py-30">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-5">
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque text-gradient">
            Profile
          </h2>
        </div>

        {/* Profile Section */}
        <div className="py-2">
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
                      alt="Profile links image"
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

                        className="bg-brand-neutral text-white rounded-md py-3 px-10 w-full poppins"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-end mt-10 lg:mt-14">
          <LogOutButton />
        </div>
      </div>
    </section>
  );
};

export default Profile;
