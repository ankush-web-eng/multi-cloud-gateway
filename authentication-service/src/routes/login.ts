import { Router } from "express";
import { signToken } from "./auth";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { AUTH_SERVICE_URL, COOKIE_DOMAIN as cookie_domain } from "../env";
import axios from "axios";

const router = Router();
const prisma = new PrismaClient();
const COOKIE_DOMAIN = cookie_domain as string;

router.post("/signin", asyncHandler(async (req, res) => {
    try {
        const { email, type, phone } = req.body;
        console.log("Received request to send OTP:", req.body);

        const foundUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });
        
        if (!foundUser) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (foundUser) {
            await prisma.user.update({
                where: {
                    id: foundUser.id
                },
                data: {
                    otp
                }
            });
        }

        console.log(otp, foundUser);

        const options = {
            channel: type === 'email' ? 'email' : type === 'sms' ? 'sms' : 'whatsapp',
            data: {
                body: "Your OTP is " + otp,
                subject: "Your OTP for Ankush's service",
                to: type === 'email' ? email : phone
            }
        };

        await axios.post(`${AUTH_SERVICE_URL}/request`, {
            service: "notification-service",
            data: options
        });

        res.json({ message: "You will shortly recieve an OTP!!" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));

router.post("/otp", asyncHandler(async (req, res) => {
    try {
        const { email, otp, phone } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.otp !== otp) return res.status(401).json({ message: "Invalid OTP" });

        const token = signToken(user.id);
        res.cookie("token", token, {
            httpOnly: true,
            domain: COOKIE_DOMAIN,
            secure: true,
            sameSite: "none",
        });

        res.json({ message: "Login successful", user: { email: user.email, name: user.name, phone: user.phone } });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));

export default router;
