import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: /^https:\/\/.*\.whyankush\.wtf$/,
  credentials: true,
}));

app.use("/auth", authRoutes);

export default app;
