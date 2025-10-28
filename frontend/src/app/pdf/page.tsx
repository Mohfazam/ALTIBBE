"use client";
import { useState } from "react";
import { generatePDF } from "@/lib/api";

export default function PDFPage() {
  const [productId, setProductId] = useState("");

  const handleDownload = async () => {
    try {
      const res = await generatePDF(productId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${productId}.pdf`;
      a.click();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to generate PDF");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-20">
      <h1 className="text-2xl font-semibold">Generate PDF</h1>
      <input
        className="border p-2 w-64 rounded"
        placeholder="Enter Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={handleDownload}
      >
        Download PDF
      </button>
    </div>
  );
}
