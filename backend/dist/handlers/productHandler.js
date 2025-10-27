"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productHandler = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.productHandler = (0, express_1.Router)();
exports.productHandler.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, sku, answers } = req.body;
    const product = yield prisma.product.create({
        data: {
            title,
            sku,
            answers: {
                create: answers.map((a) => ({
                    questionKey: a.key,
                    answer: a.value,
                })),
            },
        },
        include: { answers: true },
    });
    res.json(product);
}));
exports.productHandler.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.product.findMany({
        include: { answers: true },
    });
    res.json(products);
}));
