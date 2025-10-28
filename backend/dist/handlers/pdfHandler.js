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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfHandler = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
exports.pdfHandler = (0, express_1.Router)();
exports.pdfHandler.post("/:productId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const product = yield prisma.product.findUnique({
            where: { id: productId },
            include: { answers: true },
        });
        if (!product)
            return res.status(404).json({ error: "Product not found" });
        fs_1.default.mkdirSync("reports", { recursive: true });
        const filePath = path_1.default.join("reports", `${productId}.pdf`);
        const doc = new pdfkit_1.default();
        const writeStream = fs_1.default.createWriteStream(filePath);
        doc.pipe(writeStream);
        doc.fontSize(18).text(`Product Report: ${product.title}`, { underline: true });
        doc.moveDown();
        product.answers.forEach((a) => doc.text(`${a.questionKey}: ${JSON.stringify(a.answer)}`));
        doc.end();
        writeStream.on("close", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("PDF generated successfully:", filePath);
            yield prisma.report.create({
                data: { productId, pdfPath: filePath },
            });
            res.download(filePath, `${product.title}.pdf`, (err) => {
                if (err)
                    console.error("❌ Error sending file:", err);
            });
        }));
        writeStream.on("error", (err) => {
            console.error("PDF generation error:", err);
            res.status(500).json({ error: "Failed to generate PDF" });
        });
    }
    catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}));
