import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { COOKIE_DOMAIN as cookie_domain, JWT_SECRET as secret } from "../env";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = secret as string;
const COOKIE_DOMAIN = cookie_domain as string;

export const signToken = (userId: string) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

router.post("/signup", asyncHandler(async (req, res) => {
    try {
        const { email, name, phone, password } = req.body;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, name, phone, password: hashed },
        });

        const token = signToken(user.id);
        res.cookie("token", token, {
            httpOnly: true,
            domain: COOKIE_DOMAIN,
            secure: true,
            sameSite: "none",
        });

        res.json({ message: "Signup successful", user: { email, name, phone } });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed", error: error });
    }
}));

router.post("/login", asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: "Invalid credentials" });

        const token = signToken(user.id);
        res.cookie("token", token, {
            httpOnly: true,
            domain: COOKIE_DOMAIN,
            secure: true,
            sameSite: "none",
        });

        res.json({ message: "Login successful", user: { email: user.email, name: user.name, phone: user.phone } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error: error });
    }
}));

router.get("/me", asyncHandler(async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthenticated" });

        try {
            const { userId } = jwt.verify(token, JWT_SECRET) as { userId: string };
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ message: "User not found" });

            res.json({ user: { email: user.email, name: user.name, phone: user.phone } });
        } catch {
            res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {
        console.error("Me error:", error);
        res.status(500).json({ message: "Failed to retrieve user", error: error });
    }
}));

router.get("/verify", asyncHandler(async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: "Unauthenticated" });

        try {
            const { userId } = jwt.verify(token, JWT_SECRET) as { userId: string };
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ message: "User not found" });

            res.json({ user: { email: user.email, name: user.name, phone: user.phone } });
        } catch {
            res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {
        console.error("Verify error:", error);
        res.status(500).json({ message: "Failed to verify token", error: error });
    }
}));

export default router;
