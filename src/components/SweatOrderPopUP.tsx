import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formatAmountDefault } from "../lib/utils";
import { Country, State, City } from "country-state-city";

const MySwal = withReactContent(Swal);

export const showOrderSummary = (orderData: any) => {
  const { currency } = orderData;

  const country = Country.getAllCountries().find(
    (c) => c.isoCode === orderData.shippingAddress.country
  )?.name;

  const state = State.getStatesOfCountry(
    orderData.shippingAddress.country
  ).find((s) => s.isoCode === orderData.shippingAddress.state)?.name;

  const city = City.getCitiesOfState(
    orderData.shippingAddress.country,
    orderData.shippingAddress.state
  ).find((city) => city.name === orderData.shippingAddress.city)?.name;

  const itemsList = orderData.orderedItems
    .map(
      (item: any) =>
        `<li>
      <span><strong>${item.qty} x</strong> ${item.name}</span> |
      <span><strong>Size:</strong> ${item.size}</span> | 
      <span><strong>Color:</strong> ${item.color}</span><br/>
      <span><strong>Price:</strong> ${formatAmountDefault(
        currency,
        item.price
      )}</span>
    </li>`
    )
    .join("");

  MySwal.fire({
    title: "Order Summary",
    html: `
      <strong>Name:</strong> ${orderData.shippingAddress.firstName} ${
      orderData.shippingAddress.lastName
    } <br/>
      <strong>Email:</strong> ${orderData.email} <br/>
      <strong>Shipping Address:</strong> ${
        orderData.shippingAddress.addressLineOne
      }, ${orderData?.shippingAddress.addressLineTwo}, ${
      state || orderData.shippingAddress.state
    }, ${city || orderData.shippingAddress.city}, ${
      country || orderData.shippingAddress.country
    } - ${orderData.shippingAddress.zipCode}<br/>
      <strong>Ordered Items:</strong>
      <ul>${itemsList}</ul>
      <strong>Total Price:</strong> ${formatAmountDefault(
        currency,
        orderData.totalPrice
      )} <br/>
      <strong>Paid At:</strong> ${new Date(
        orderData.paidAt
      ).toLocaleString()} <br/>
      <strong>Payment Status:</strong> ${
        orderData.paymentResult.payment.status
      } <br/>
    `,
    icon: "success",
    confirmButtonText: "Close",
    confirmButtonColor: "#04BB6E",
  });
};
