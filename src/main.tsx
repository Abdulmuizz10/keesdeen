import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ShopContextProvider } from "./context/ShopContext.tsx";
import { AuthContextProvider } from "./context/AuthContext/AuthContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProductContextProvider } from "./context/ProductContext/ProductContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        <ProductContextProvider>
          <ShopContextProvider>
            <App />
          </ShopContextProvider>
        </ProductContextProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
