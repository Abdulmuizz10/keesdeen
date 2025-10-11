// export const URL = "https://api.keesdeen.com";

import { Images } from "../assets";

export const URL = import.meta.env.VITE_API_URL;

export const profileLinks = [
  // {
  //   title: "Profile Info",
  //   route: "",
  //   image: Images.profile,
  //   text: "Access your personal information, including your name and email. Ensure your details are accurate to enjoy a smooth shopping experience and stay updated with the latest offers and notifications.",
  // },
  {
    title: "Order History",
    route: "/order_history",
    image: Images.orders,
    text: "Your order details include all the items you purchased, their prices, and any discounts. You can also see the total amount you paid and your payment method. Check the current status of your order, like whether it’s being prepared or shipped.",
  },
  // {
  //   title: "Cards",
  //   route: "",
  //   image: Images.card,
  //   text: "View your previously stored payment cards securely. Easily identify your cards by the last four digits and their expiry dates. Stored cards are for quick reference during checkout. Your payment details remain safe and accessible only to you. Enjoy a smoother shopping experience!",
  // },
];

export const currency = "GBP";
