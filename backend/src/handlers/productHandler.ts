import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const productHandler = Router();


productHandler.post("/", async (req, res) => {
  const { title, sku, answers } = req.body;

  const product = await prisma.product.create({
    data: {
      title,
      sku,
      answers: {
        create: answers.map((a: any) => ({
          questionKey: a.key,
          answer: a.value,
        })),
      },
    },
    include: { answers: true },
  });

  res.json(product);
});


productHandler.get("/", async (_, res) => {
  const products = await prisma.product.findMany({
    include: { answers: true },
  });
  res.json(products);
});
