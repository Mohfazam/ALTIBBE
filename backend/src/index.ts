import express from "express";
import cors from "cors";
import { authHandler } from "./handlers/authHandler";
import { productHandler } from "./handlers/productHandler";
import { pdfHandler } from "./handlers/pdfHandler";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authHandler);
app.use("/product", productHandler);
app.use("/pdf", pdfHandler);

const PORT =  4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
