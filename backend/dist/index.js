"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authHandler_1 = require("./handlers/authHandler");
const productHandler_1 = require("./handlers/productHandler");
const pdfHandler_1 = require("./handlers/pdfHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", authHandler_1.authHandler);
app.use("/product", productHandler_1.productHandler);
app.use("/pdf", pdfHandler_1.pdfHandler);
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
