"use client";
import { useState } from "react";
import { FileDown, Loader2, FileText, AlertCircle } from "lucide-react";

export default function PDFPage() {
  const [productId, setProductId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!productId.trim()) {
      setError("Please enter a Product ID");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulated API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // In actual implementation, use:
      // const res = await generatePDF(productId);
      // const blob = new Blob([res.data], { type: "application/pdf" });
      
      // Simulated download
      console.log(`Generating PDF for product: ${productId}`);
      alert(`PDF for ${productId} would be downloaded here`);
      
      // Actual download logic:
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = `${productId}.pdf`;
      // a.click();
      // window.URL.revokeObjectURL(url);
      
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleDownload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 p-8 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Generate PDF</h1>
            <p className="text-slate-300">Enter your product ID to download the PDF report</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none transition-colors bg-white text-slate-900 placeholder:text-slate-400 ${
                  error ? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-blue-600"
                }`}
                placeholder="e.g., PROD-ABC123XYZ"
                disabled={isLoading}
              />
              {error && (
                <div className="flex items-start gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={isLoading || !productId.trim()}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold text-white shadow-md transition-all ${
                isLoading || !productId.trim()
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileDown className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </button>

            {/* Info Section */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">How it works</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Enter the Product ID from your confirmation</li>
                <li>• Click the download button to generate PDF</li>
                <li>• Your product report will download automatically</li>
              </ul>
            </div>

            {/* Back Link */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                ← Back to Create Product
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}