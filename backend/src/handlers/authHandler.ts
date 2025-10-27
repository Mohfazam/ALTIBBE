import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export const authHandler = Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";


authHandler.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash: hash },
    });
    res.json({ id: user.id, email: user.email });
  } catch {
    res.status(400).json({ error: "User already exists" });
  }
});


authHandler.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});
