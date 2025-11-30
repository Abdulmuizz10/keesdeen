import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

//routes
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import utilityRoutes from "./routes/utilityRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import dashboardAnalyticsRoutes from "./routes/dashboardAnalyticsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

// express initialization
const app = express();

//middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

//routes declarations
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/subscribers", subscriberRoutes);
app.use("/address", addressRoutes);
app.use("/utility", utilityRoutes);
app.use("/coupons", couponRoutes);
app.use("/analytics", dashboardAnalyticsRoutes);
app.use("/settings", settingsRoutes);

//database initialization
const PORT = process.env.PORT || 5000;
const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_DB_URL
    : process.env.LOCAL_URL;

mongoose
  .connect(DATABASE_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server connected to port: ${PORT}`))
  )
  .catch((error) =>
    console.log(`${error}Server is not connected to port: ${PORT}`)
  );
