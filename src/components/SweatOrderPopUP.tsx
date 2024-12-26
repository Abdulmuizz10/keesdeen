import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formatAmountDefault } from "../lib/utils";

const MySwal = withReactContent(Swal);

export const showOrderSummary = (orderData: any) => {
  const { currency } = orderData;
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
      <strong>Name:</strong> ${orderData.firstName} ${orderData.lastName} <br/>
      <strong>Email:</strong> ${orderData.email} <br/>
      <strong>Shipping Address:</strong> ${orderData.addressLineOne}, ${
      orderData?.addressLineTwo
    }, ${orderData.cityAndRegion}, ${orderData.country} - ${
      orderData.zipCode
    }<br/>
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
