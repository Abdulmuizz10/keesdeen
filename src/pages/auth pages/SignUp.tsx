// import React, { useContext, useState } from "react";
// import { Button, Input, Label } from "@relume_io/relume-ui";
// import type { ButtonProps } from "@relume_io/relume-ui";
// import { BiLogoGoogle } from "react-icons/bi";
// import { Link, useHistory } from "react-router-dom";
// import { mainLogo } from "../../assets";
// import { AuthContext } from "../../context/AuthContext/AuthContext";
// import { SignUp } from "../../context/AuthContext/AuthApiCalls";

// type ImageProps = {
//   url?: string;
//   src: string;
//   alt?: string;
// };

// type Props = {
//   logo: ImageProps;
//   title: string;
//   description: string;
//   signUpButton: ButtonProps;
//   signUpWithGoogleButton: ButtonProps;
//   image: ImageProps;
//   logInText: string;
//   logInLink: {
//     text: string;
//     url: string;
//   };
//   footerText: string;
// };

// export type Signup7Props = React.ComponentPropsWithoutRef<"section"> &
//   Partial<Props>;

// export const Signup7: React.FC = (props: Signup7Props) => {
//   const {
//     logo,
//     title,
//     description,
//     signUpButton,
//     signUpWithGoogleButton,
//     image,
//     logInText,
//     logInLink,
//     footerText,
//   } = {
//     ...Signup7Defaults,
//     ...props,
//   } as Props;

//   const [userName, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { dispatch } = useContext(AuthContext);
//   const history = useHistory();

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     SignUp({ username: userName, email, password }, dispatch, history);
//     history.push("/");
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
//                 <Label htmlFor="name" className="mb-2">
//                   Name*
//                 </Label>
//                 <Input
//                   type="text"
//                   id="text"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   required
//                 />
//               </div>
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
//                 <Label htmlFor="password" className="mb-2">
//                   Password*
//                 </Label>
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
//                   variant={signUpButton.variant}
//                   size={signUpButton.size}
//                   iconLeft={signUpButton.iconLeft}
//                   iconRight={signUpButton.iconRight}
//                 >
//                   {signUpButton.title}
//                 </Button>
//                 <Button
//                   variant={signUpWithGoogleButton.variant}
//                   size={signUpWithGoogleButton.size}
//                   iconLeft={signUpWithGoogleButton.iconLeft}
//                   iconRight={signUpWithGoogleButton.iconRight}
//                   className="gap-x-3"
//                 >
//                   {signUpWithGoogleButton.title}
//                 </Button>
//               </div>
//             </form>
//             <div className="mt-5 inline-flex w-full items-center justify-center gap-x-1 text-center md:mt-6">
//               <p>{logInText}</p>
//               <Link to={logInLink.url} className="underline">
//                 {logInLink.text}
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

// export const Signup7Defaults: Signup7Props = {
//   logo: {
//     url: "/",
//     src: mainLogo,
//     alt: "Logo text",
//   },
//   title: "Sign Up",
//   description: "Lorem ipsum dolor sit amet adipiscing elit.",
//   signUpButton: {
//     title: "Sign up",
//   },
//   signUpWithGoogleButton: {
//     variant: "secondary",
//     title: "Sign up with Google",
//     iconLeft: <BiLogoGoogle className="size-6" />,
//   },
//   image: {
//     src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
//     alt: "Relume placeholder image",
//   },
//   logInText: "Already have an account?",
//   logInLink: {
//     text: "Log in",
//     url: "/register/login",
//   },
//   footerText: "© 2024 Keesdeen",
// };

// import React, { useContext, useState } from "react";
// import { Button, Input, Label } from "@relume_io/relume-ui";
// import type { ButtonProps } from "@relume_io/relume-ui";
// import { BiLogoGoogle } from "react-icons/bi";
// import { Link, useHistory } from "react-router-dom";
// import { mainLogo } from "../../assets";
// import { AuthContext } from "../../context/AuthContext/AuthContext";
// import { SignUp } from "../../context/AuthContext/AuthApiCalls";

// type ImageProps = {
//   url?: string;
//   src: string;
//   alt?: string;
// };

// type Props = {
//   logo: ImageProps;
//   title: string;
//   description: string;
//   signUpButton: ButtonProps;
//   signUpWithGoogleButton: ButtonProps;
//   image: ImageProps;
//   logInText: string;
//   logInLink: {
//     text: string;
//     url: string;
//   };
// };

// export type Signup7Props = React.ComponentPropsWithoutRef<"section"> &
//   Partial<Props>;

// export const Signup7: React.FC = (props: Signup7Props) => {
//   const {
//     logo,
//     title,
//     description,
//     signUpButton,
//     signUpWithGoogleButton,
//     image,
//     logInText,
//     logInLink,
//   } = {
//     ...Signup7Defaults,
//     ...props,
//   } as Props;

//   const [userName, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { dispatch } = useContext(AuthContext);
//   const history = useHistory();

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     SignUp({ username: userName, email, password }, dispatch, history);
//     history.push("/");
//   };

//   return (
//     <section className="bg-neutral-100">
//       <div className="relative grid min-h-screen grid-cols-1 items-stretch justify-center overflow-auto lg:grid-cols-2">
//         <div className="absolute top-0 z-10 flex h-16 w-full items-center justify-between px-5">
//           <a href={logo.url}>
//             <img src={logo.src} alt={logo.alt} className="w-full h-[25px]" />
//           </a>
//         </div>
//         <div className="relative mx-5 flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
//           <div className="container max-w-sm">
//             <div className="mb-6 text-center">
//               <h1 className="mb-5 text-5xl font-bold text-neutral-800 md:mb-6 md:text-7xl lg:text-8xl">
//                 {title}
//               </h1>
//               <p className="text-neutral-600 md:text-md">{description}</p>
//             </div>
//             <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
//               <div className="grid w-full items-center">
//                 <Label htmlFor="name" className="mb-2 text-neutral-700">
//                   Name*
//                 </Label>
//                 <Input
//                   type="text"
//                   id="name"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   required
//                   className="border border-neutral-300 rounded"
//                 />
//               </div>
//               <div className="grid w-full items-center">
//                 <Label htmlFor="email" className="mb-2 text-neutral-700">
//                   Email*
//                 </Label>
//                 <Input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="border border-neutral-300 rounded"
//                 />
//               </div>
//               <div className="grid w-full items-center">
//                 <Label htmlFor="password" className="mb-2 text-neutral-700">
//                   Password*
//                 </Label>
//                 <Input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="border border-neutral-300 rounded"
//                 />
//               </div>
//               <div className="grid-col-1 grid gap-4">
//                 <Button
//                 // variant="default" // Use default variant for a simple style
//                 // className="bg-gray-300 hover:bg-gray-400 text-black rounded"
//                 >
//                   {signUpButton.title}
//                 </Button>
//                 <Button
//                   // variant="default" // Use default variant for a simple style
//                   className="bg-gray-300 hover:bg-gray-400 text-black rounded flex items-center gap-x-3"
//                 >
//                   <BiLogoGoogle className="size-6" />
//                   {signUpWithGoogleButton.title}
//                 </Button>
//               </div>
//             </form>
//             <div className="mt-5 inline-flex w-full items-center justify-center gap-x-1 text-center md:mt-6">
//               <p>{logInText}</p>
//               <Link to={logInLink.url} className="underline text-[#04BB6E]">
//                 {logInLink.text}
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="hidden lg:block bg-background-secondary">
//           <img
//             src={image.src}
//             alt={image.alt}
//             className="h-full w-full object-cover"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export const Signup7Defaults: Signup7Props = {
//   logo: {
//     url: "/",
//     src: mainLogo,
//     alt: "Logo text",
//   },
//   title: "Sign Up",
//   description: "Join us to explore our exclusive collection.",
//   signUpButton: {
//     title: "Sign up",
//   },
//   signUpWithGoogleButton: {
//     // variant: "default", // No special variant needed
//     title: "Sign up with Google",
//   },
//   image: {
//     src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
//     alt: "Placeholder image",
//   },
//   logInText: "Already have an account?",
//   logInLink: {
//     text: "Log in",
//     url: "/register/login",
//   },
// };

"use client";

import React, { useContext, useState } from "react";
import { Button, Input, Label } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { BiLogoGoogle } from "react-icons/bi";
import { Link, useHistory } from "react-router-dom";
import { mainLogo } from "../../assets";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { SignUp } from "../../context/AuthContext/AuthApiCalls";

type ImageProps = {
  url?: string;
  src: string;
  alt?: string;
};

type Props = {
  logo: ImageProps;
  title: string;
  description: string;
  signUpButton: ButtonProps;
  signUpWithGoogleButton: ButtonProps;
  image: ImageProps;
  logInText: string;
  logInLink: {
    text: string;
    url: string;
  };
};

export type Signup7Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Signup7: React.FC = (props: Signup7Props) => {
  const {
    logo,
    title,
    description,
    signUpButton,
    signUpWithGoogleButton,
    image,
    logInText,
    logInLink,
  } = {
    ...Signup7Defaults,
    ...props,
  } as Props;

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    SignUp({ username: userName, email, password }, dispatch, history);
    history.push("/");
  };

  return (
    <section className="bg-neutral-100">
      <div className="relative grid min-h-screen grid-cols-1 items-stretch justify-center overflow-auto lg:grid-cols-2 overflow-x-hidden">
        <div className="absolute left-0 right-0 top-0 z-10 flex h-16 w-full items-center justify-center px-[5%] md:h-18 lg:justify-between">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} className="w-full h-[25px]" />
          </a>
        </div>
        <div className="relative mx-5 flex items-center justify-center pb-16 pt-20 md:pb-20 md:pt-24 lg:py-20">
          <div className="container max-w-sm">
            <div className="mb-6 text-center">
              <h1 className="mb-5 text-5xl font-bold text-neutral-800 md:mb-6 md:text-7xl lg:text-8xl">
                {title}
              </h1>
              <p className="text-neutral-600 md:text-md">{description}</p>
            </div>
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
              <div className="grid w-full items-center">
                <Label htmlFor="name" className="mb-2 text-neutral-700">
                  Name*
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="border-neutral-300 rounded"
                />
              </div>
              <div className="grid w-full items-center">
                <Label htmlFor="email" className="mb-2 text-neutral-700">
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
                <Label htmlFor="password" className="mb-2 text-neutral-700">
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
                  variant={signUpButton.variant}
                  size={signUpButton.size}
                  iconLeft={signUpButton.iconLeft}
                  iconRight={signUpButton.iconRight}
                >
                  {signUpButton.title}
                </Button>
                <Button
                  variant={signUpWithGoogleButton.variant}
                  size={signUpWithGoogleButton.size}
                  iconLeft={signUpWithGoogleButton.iconLeft}
                  iconRight={signUpWithGoogleButton.iconRight}
                  className="gap-x-3"
                >
                  {signUpWithGoogleButton.title}
                </Button>
              </div>
            </form>
            <div className="mt-5 inline-flex w-full items-center justify-center gap-x-1 text-center md:mt-6">
              <p>{logInText}</p>
              <Link to={logInLink.url} className="underline text-[#04BB6E]">
                {logInLink.text}
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden lg:block bg-background-secondary">
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

export const Signup7Defaults: Signup7Props = {
  logo: {
    url: "/",
    src: mainLogo,
    alt: "Logo text",
  },
  title: "Sign Up",
  description: "Join us to explore our exclusive collection.",
  signUpButton: {
    title: "Sign up",
  },
  signUpWithGoogleButton: {
    variant: "secondary",
    title: "Sign up with Google",
    iconLeft: <BiLogoGoogle className="size-6" />,
  },
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Placeholder image",
  },
  logInText: "Already have an account?",
  logInLink: {
    text: "Log in",
    url: "/register/login",
  },
};
