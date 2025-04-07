import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: /^https:\/\/.*\.whyankush\.wtf$/,
  credentials: true,
}));

app.use("/auth", authRoutes);

export default app;
