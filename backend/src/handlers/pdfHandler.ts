import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
export const pdfHandler = Router();

pdfHandler.post("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { answers: true },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    fs.mkdirSync("reports", { recursive: true });
    const filePath = path.join("reports", `${productId}.pdf`);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text(`Product Report: ${product.title}`, { underline: true });
    doc.moveDown();

    product.answers.forEach((a) =>
      doc.text(`${a.questionKey}: ${JSON.stringify(a.answer)}`)
    );

    doc.end();

    
    writeStream.on("close", async () => {
      console.log("PDF generated successfully:", filePath);

      
      await prisma.report.create({
        data: { productId, pdfPath: filePath },
      });

      
      res.download(filePath, `${product.title}.pdf`, (err) => {
        if (err) console.error("❌ Error sending file:", err);
      });
    });

    writeStream.on("error", (err) => {
      console.error("PDF generation error:", err);
      res.status(500).json({ error: "Failed to generate PDF" });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
