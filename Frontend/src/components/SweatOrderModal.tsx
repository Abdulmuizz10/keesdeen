// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { Country, State } from "country-state-city";

// const MySwal = withReactContent(Swal);

// export const showOrderSummary = (orderData: any) => {
//   const country = Country.getAllCountries().find(
//     (c) => c.isoCode === orderData.shippingAddress.country
//   )?.name;

//   const state = State.getStatesOfCountry(
//     orderData.shippingAddress.country
//   ).find((s) => s.isoCode === orderData.shippingAddress.state)?.name;

//   MySwal.fire({
//     title: "Payment Successful!",
//     html: `
//     <div style="font-size: 13px; font-family: poppins";>
//       <strong>Name:</strong> ${orderData.shippingAddress.firstName} ${
//       orderData.shippingAddress.lastName
//     } <br/>
//       <strong>Email:</strong> ${orderData.email} <br/>
//       <strong>Shipping Address:</strong> ${
//         orderData.shippingAddress.address1
//       }, ${orderData?.shippingAddress.address2}, ${
//       state || orderData.shippingAddress.state
//     }, ${country || orderData.shippingAddress.country} - ${
//       orderData.shippingAddress.postalCode
//     }<br/>
//       <strong>Paid At:</strong> ${new Date(
//         orderData.paidAt
//       ).toLocaleString()} <br/>
//       <strong>Payment Status:</strong> ${
//         orderData.paymentResult.payment.status
//       } <br/>
//     </div>
//   `,
//     icon: "success",
//     confirmButtonText: "Close",
//     confirmButtonColor: "#04BB6E",
//   });
// };

// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { Country, State } from "country-state-city";

// const MySwal = withReactContent(Swal);

// export const showOrderSummary = (orderData: any) => {
//   const country = Country.getAllCountries().find(
//     (c) => c.isoCode === orderData.shippingAddress.country
//   )?.name;

//   const state = State.getStatesOfCountry(
//     orderData.shippingAddress.country
//   ).find((s) => s.isoCode === orderData.shippingAddress.state)?.name;

//   const itemsHtml = orderData.orderedItems
//     .map(
//       (item: any) => `
//       <tr>
//         <td style="padding: 6px 0;">${item.qty} × ${item.name}</td>
//         <td style="text-align:right;">£${item.price.toFixed(2)}</td>
//       </tr>`
//     )
//     .join("");

//   const html = `
//     <div style="font-size:14px; font-family: 'Poppins', sans-serif; color:#333; text-align:left;">
//       <p style="font-size:16px; font-weight:600; color:#04BB6E; margin-bottom:6px;">Thank you for your purchase!</p>
//       <p>Your order has been placed successfully.</p>

//       <hr style="border:none; border-top:1px solid #eee; margin:12px 0;" />

//       <p><strong>Order ID:</strong> ${orderData._id}</p>
//       <p><strong>Date:</strong> ${new Date(
//         orderData.paidAt
//       ).toLocaleString()}</p>
//       <p><strong>Payment Status:</strong>
//         <span style="color:${
//           orderData.paymentResult.payment.status === "COMPLETED"
//             ? "#04BB6E"
//             : "#DA5B14"
//         };">
//           ${orderData.paymentResult.payment.status}
//         </span>
//       </p>

//       <hr style="border:none; border-top:1px solid #eee; margin:12px 0;" />

//       <p style="font-weight:600; margin-bottom:6px;">Shipping Information</p>
//       <p>${orderData.shippingAddress.firstName} ${
//     orderData.shippingAddress.lastName
//   }</p>
//       <p>${orderData.shippingAddress.address1}${
//     orderData.shippingAddress.address2
//       ? ", " + orderData.shippingAddress.address2
//       : ""
//   }</p>
//       <p>${state || orderData.shippingAddress.state}, ${
//     country || orderData.shippingAddress.country
//   }</p>
//       <p>${orderData.shippingAddress.postalCode}</p>
//       <p>Email: ${orderData.email}</p>

//       <hr style="border:none; border-top:1px solid #eee; margin:12px 0;" />

//       <p style="font-weight:600; margin-bottom:8px;">Order Summary</p>
//       <table width="100%" style="border-collapse:collapse; margin-bottom:8px;">
//         ${itemsHtml}
//         <tr>
//           <td style="border-top:1px solid #eee; padding-top:8px; font-weight:600;">Total</td>
//           <td style="border-top:1px solid #eee; padding-top:8px; text-align:right; font-weight:600;">
//             £${orderData.totalPrice.toFixed(2)}
//           </td>
//         </tr>
//       </table>

//       ${
//         orderData.paymentResult?.payment?.receiptUrl
//           ? `<a href="${orderData.paymentResult.payment.receiptUrl}" target="_blank"
//               style="display:inline-block; margin-top:8px; color:#04BB6E; font-weight:500; text-decoration:none;">
//               View Receipt ↗
//             </a>`
//           : ""
//       }
//     </div>
//   `;

//   MySwal.fire({
//     title: "Payment Successful! 🎉",
//     html,
//     icon: "success",
//     confirmButtonText: "Continue Shopping",
//     confirmButtonColor: "#04BB6E",
//     width: 600,
//   });
// };

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Country, State } from "country-state-city";

const MySwal = withReactContent(Swal);

export const showOrderSummary = (orderData: any) => {
  const country = Country.getAllCountries().find(
    (c) => c.isoCode === orderData.shippingAddress.country
  )?.name;

  const state = State.getStatesOfCountry(
    orderData.shippingAddress.country
  ).find((s) => s.isoCode === orderData.shippingAddress.state)?.name;

  const itemsHtml = orderData.orderedItems
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 6px 0;">${item.qty} × ${item.name}</td>
        <td style="text-align:right;">£${item.price.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-size:14px; font-family:'Poppins', sans-serif; color:#333;">
      <p style="font-size:16px; font-weight:600; color:#04BB6E; margin-bottom:6px;">
        Thank you for your purchase!
      </p>
      <p>Your order has been placed successfully.</p>

      <hr style="border:none; border-top:1px solid #eee; margin:12px 0;" />

      <p><strong>Order ID:</strong> ${orderData._id}</p>
      <p><strong>Date:</strong> ${new Date(
        orderData.paidAt
      ).toLocaleString()}</p>
      <p><strong>Payment Status:</strong>
        <span style="color:${
          orderData.paymentResult.payment.status === "COMPLETED"
            ? "#04BB6E"
            : "#DA5B14"
        };">
          ${orderData.paymentResult.payment.status}
        </span>
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:12px 0;" />

      <!-- Responsive Container -->
      <div style="
        display:flex;
        flex-wrap:wrap;
        justify-content:space-between;
        gap:20px;
      ">

        <!-- Shipping Information -->
        <div style="flex:1 1 45%; min-width:260px;">
          <p style="font-weight:600; margin-bottom:6px;">Shipping Information</p>
          <p>${orderData.shippingAddress.firstName} ${
    orderData.shippingAddress.lastName
  }</p>
          <p>${orderData.shippingAddress.address1}${
    orderData.shippingAddress.address2
      ? ", " + orderData.shippingAddress.address2
      : ""
  }</p>
          <p>${state || orderData.shippingAddress.state}, ${
    country || orderData.shippingAddress.country
  }</p>
          <p>${orderData.shippingAddress.postalCode}</p>
          <p>Email: ${orderData.email}</p>
        </div>

        <!-- Order Summary -->
        <div style="flex:1 1 45%; min-width:260px;">
          <p style="font-weight:600; margin-bottom:8px;">Order Summary</p>
          <table width="100%" style="border-collapse:collapse; margin-bottom:8px;">
            ${itemsHtml}
            <tr>
              <td style="border-top:1px solid #eee; padding-top:8px; font-weight:600;">Total</td>
              <td style="border-top:1px solid #eee; padding-top:8px; text-align:right; font-weight:600;">
                £${orderData.totalPrice.toFixed(2)}
              </td>
            </tr>
          </table>

          ${
            orderData.paymentResult?.payment?.receiptUrl
              ? `<a href="${orderData.paymentResult.payment.receiptUrl}" target="_blank"
                  style="display:inline-block; margin-top:8px; color:#04BB6E; font-weight:500; text-decoration:none;">
                  View Receipt ↗
                </a>`
              : ""
          }
        </div>
      </div>
    </div>
  `;

  MySwal.fire({
    title: "Payment Successful! 🎉",
    html,
    icon: "success",
    confirmButtonText: "Continue Shopping",
    confirmButtonColor: "#04BB6E",
    width: 600,
  });
};
