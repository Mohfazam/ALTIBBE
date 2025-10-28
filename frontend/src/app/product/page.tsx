"use client";
import { useState } from "react";
import { createProduct } from "@/lib/api";

export default function ProductPage() {
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [answers, setAnswers] = useState([
    { questionKey: "category", answer: "electronics" },
    { questionKey: "weight_kg", answer: 0.45 },
    { questionKey: "is_fragile", answer: true },
    { questionKey: "warranty_years", answer: 1 },
  ]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in first");

    try {
      const res = await createProduct({ title, sku, answers }, token);
      alert("Product created: " + res.data.title);
    } catch (error: any) {
      alert(error.response?.data?.error || "Error creating product");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-20">
      <h1 className="text-2xl font-semibold">Create Product</h1>
      <input
        className="border p-2 w-64 rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2 w-64 rounded"
        placeholder="SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Save Product
      </button>
    </div>
  );
}
