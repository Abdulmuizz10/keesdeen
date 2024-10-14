// "use client";

// import React, { useContext, useState } from "react";
// import { Button, Input, Label } from "@relume_io/relume-ui";
// import type { ButtonProps } from "@relume_io/relume-ui";
// import { BiLogoGoogle } from "react-icons/bi";
// import { Link, useHistory } from "react-router-dom";
// import { mainLogo } from "../../assets";
// import { AuthContext } from "../../context/AuthContext/AuthContext";
// import { Login } from "../../context/AuthContext/AuthApiCalls";

// type ImageProps = {
//   url?: string;
//   src: string;
//   alt?: string;
// };

// type Props = {
//   logo: ImageProps;
//   title: string;
//   description: string;
//   logInButton: ButtonProps;
//   logInWithGoogleButton: ButtonProps;
//   forgotPassword: {
//     text: string;
//     url: string;
//   };
//   image: ImageProps;
//   signUpText: string;
//   signUpLink: {
//     text: string;
//     url: string;
//   };
//   footerText: string;
// };

// export type Login7Props = React.ComponentPropsWithoutRef<"section"> &
//   Partial<Props>;

// export const Login7: React.FC = (props: Login7Props) => {
//   const {
//     logo,
//     title,
//     description,
//     logInButton,
//     logInWithGoogleButton,
//     image,
//     signUpText,
//     signUpLink,
//     footerText,
//   } = {
//     ...Login7Defaults,
//     ...props,
//   } as Props;

//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const { dispatch } = useContext(AuthContext);

//   const history = useHistory();

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     console.log({ email, password });
//     Login({ email, password }, dispatch, history);
//   };

//   return (
//     <section>
//       <div className="relative grid min-h-screen grid-cols-1 items-stretch justify-center overflow-auto lg:grid-cols-2">
//         <div className="absolute bottom-auto left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-[5%] md:h-18 lg:justify-between">
//           <a href={logo.url}>
//             <img src={logo.src} alt={logo.alt} className="w-full h-[25px]" />
//           </a>
//         </div>
//         <div className="relative mx-[5vw] flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
//           <div className="container max-w-sm">
//             <div className="container mb-6 max-w-lg text-center md:mb-8">
//               <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
//                 {title}
//               </h1>
//               <p className="md:text-md">{description}</p>
//             </div>
//             <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
//               <div className="grid w-full items-center">
//                 <Label htmlFor="email" className="mb-2">
//                   Email*
//                 </Label>
//                 <Input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="grid w-full items-center">
//                 <div className="flex items-start justify-between">
//                   <Label htmlFor="password" className="mb-2">
//                     Password*
//                   </Label>
//                   {/* <a href={forgotPassword.url} className="underline">
//                     {forgotPassword.text}
//                   </a> */}
//                 </div>
//                 <Input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="grid-col-1 grid gap-4">
//                 <Button
//                   variant={logInButton.variant}
//                   size={logInButton.size}
//                   iconLeft={logInButton.iconLeft}
//                   iconRight={logInButton.iconRight}
//                 >
//                   {logInButton.title}
//                 </Button>
//                 <Button
//                   variant={logInWithGoogleButton.variant}
//                   size={logInWithGoogleButton.size}
//                   iconLeft={logInWithGoogleButton.iconLeft}
//                   iconRight={logInWithGoogleButton.iconRight}
//                   className="gap-x-3"
//                 >
//                   {logInWithGoogleButton.title}
//                 </Button>
//               </div>
//             </form>
//             <div className="mt-5 inline-flex w-full items-center justify-center gap-x-1 text-center md:mt-6">
//               <p>{signUpText}</p>
//               <Link to={signUpLink.url} className="underline">
//                 {signUpLink.text}
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="hidden bg-background-secondary lg:block">
//           <img
//             src={image.src}
//             alt={image.alt}
//             className="h-full w-full object-cover"
//           />
//         </div>
//         <footer className="absolute bottom-0 left-0 right-0 top-auto flex h-16 w-full items-center justify-center pr-[5%] md:h-18 lg:justify-start lg:px-[5%]">
//           <p className="text-sm">{footerText}</p>
//         </footer>
//       </div>
//     </section>
//   );
// };

// export const Login7Defaults: Login7Props = {
//   logo: {
//     url: "/",
//     src: mainLogo,
//     alt: "Logo text",
//   },
//   title: "Log in",
//   description: "Lorem ipsum dolor sit amet adipiscing elit.",
//   logInButton: {
//     title: "Log in",
//   },
//   logInWithGoogleButton: {
//     variant: "secondary",
//     title: "Log in with Google",
//     iconLeft: <BiLogoGoogle className="size-6" />,
//   },
//   image: {
//     src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
//     alt: "Relume placeholder image",
//   },
//   forgotPassword: {
//     text: "Forgot your password?",

//     url: "#",
//   },
//   signUpText: "Don't have an account?",
//   signUpLink: {
//     text: "Sign up",
//     url: "/register/signUp",
//   },
//   footerText: "© 2024 Keesdeen",
// };

"use client";

import React, { useContext, useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiLogoGoogle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { mainLogo } from "../../assets";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Login } from "../../context/AuthContext/AuthApiCalls";
import { GoogleLogin } from "react-google-login";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Props = {
  logo: ImageProps;
  title: string;
  description: string;
  logInButton: ButtonProps;
  logInWithGoogleButton: ButtonProps;
  image: ImageProps;
  signUpText: string;
  signUpLink: {
    text: string;
    url: string;
  };
};

export type Login7Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Login7: React.FC = (props: Login7Props) => {
  const {
    logo,
    title,
    description,
    logInButton,
    logInWithGoogleButton,
    image,
    signUpText,
    signUpLink,
  } = {
    ...Login7Defaults,
    ...props,
  } as Props;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Login({ email, password }, dispatch, navigate);
  };

  const handleLoginSuccess = async (response: any) => {
    const token = response.tokenId;

    // Send the token to the backend
    const res = await fetch("http://localhost:5000/auth/google-sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      const userData = await res.json();
      console.log("User authenticated", userData);
    } else {
      console.error("Failed to authenticate");
    }
  };

  const handleLoginFailure = (error: any) => {
    if (error.error === "popup_closed_by_user") {
      console.warn("Login failed: Popup was closed by the user.");
      alert(
        "The login popup was closed before completing the login. Please try again and complete the login process."
      );
    } else {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const ClientID = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID;
  return (
    <section className="bg-neutral-100">
      <div className="relative grid min-h-screen grid-cols-1 items-stretch justify-center overflow-auto lg:grid-cols-2">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-[5%] md:h-18 lg:justify-between">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} className="w-full h-[25px]" />
          </a>
        </div>
        <div className="relative mx-[5vw] flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
          <div className="container max-w-sm">
            <div className="container mb-6 max-w-lg text-center md:mb-8">
              <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl bricolage-grotesque">
                {title}
              </h1>
              <p className="md:text-md">{description}</p>
            </div>
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
              <div className="grid w-full items-center">
                <Label htmlFor="email" className="mb-2">
                  Email*
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-neutral-300 rounded"
                />
              </div>
              <div className="grid w-full items-center">
                <Label htmlFor="password" className="mb-2">
                  Password*
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-neutral-300 rounded"
                />
              </div>
              <div className="grid-col-1 grid gap-4">
                <Button
                  variant={logInButton.variant}
                  size={logInButton.size}
                  iconLeft={logInButton.iconLeft}
                  iconRight={logInButton.iconRight}
                >
                  {logInButton.title}
                </Button>

                <GoogleLogin
                  clientId={ClientID}
                  onSuccess={handleLoginSuccess}
                  onFailure={handleLoginFailure}
                  cookiePolicy={"single_host_origin"}
                  render={(renderProps) => (
                    <Button
                      variant={logInWithGoogleButton.variant}
                      size={logInWithGoogleButton.size}
                      iconLeft={logInWithGoogleButton.iconLeft}
                      iconRight={logInWithGoogleButton.iconRight}
                      className="bg-gray-300 hover:bg-gray-400 text-black rounded flex items-center gap-x-3"
                      onClick={renderProps.onClick} // Trigger Google login on button click
                      disabled={renderProps.disabled}
                    >
                      {logInWithGoogleButton.title}
                    </Button>
                  )}
                />
                {/* <GoogleLogin
                  clientId={
                    "560387369413-kfukf8unvkob81r6jo2b7rfm8ecgodls.apps.googleusercontent.com"
                  }
                  buttonText="Login with Google"
                  onSuccess={handleLoginSuccess}
                  onFailure={handleLoginFailure}
                  cookiePolicy={"single_host_origin"}
                /> */}
              </div>
            </form>
            <div className="mt-5 inline-flex w-full items-center justify-center gap-x-1 text-center md:mt-6">
              <p>{signUpText}</p>
              <Link to={signUpLink.url} className="underline text-[#04BB6E]">
                {signUpLink.text}
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-background-secondary lg:block">
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export const Login7Defaults: Login7Props = {
  logo: {
    url: "/",
    src: mainLogo,
    alt: "Logo text",
  },
  title: "Log in",
  description: "Lorem ipsum dolor sit amet adipiscing elit.",
  logInButton: {
    title: "Log in",
  },
  logInWithGoogleButton: {
    variant: "secondary",
    title: "Log in with Google",
    iconLeft: <BiLogoGoogle className="size-6" />,
  },
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Placeholder image",
  },
  signUpText: "Don't have an account?",
  signUpLink: {
    text: "Sign up",
    url: "/register/signUp",
  },
};
