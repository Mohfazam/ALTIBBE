"use client";
import { useState, useEffect } from "react";
import { FileDown, Loader2, FileText, AlertCircle, Check } from "lucide-react";

interface ProductData {
  title?: string;
  sku?: string;
  category?: string;
  weight_kg?: number;
  is_fragile?: string;
  dimensions?: string;
  warranty_years?: number;
  support_features?: string[];
  description?: string;
  price?: number;
}

export default function PDFPage() {
  const [productId, setProductId] = useState("");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load product ID and data from sessionStorage
    const storedId = sessionStorage.getItem('productId');
    const storedData = sessionStorage.getItem('productData');
    
    if (storedId) {
      setProductId(storedId);
    }
    
    if (storedData) {
      try {
        setProductData(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to parse product data:", e);
      }
    }
    
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const generatePDFContent = (): string => {
    if (!productData) return '';
    
    let content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Product Report - ${productId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
    .header { background: #1e293b; color: white; padding: 30px; margin: -40px -40px 30px -40px; }
    .header h1 { margin: 0 0 10px 0; font-size: 32px; }
    .header p { margin: 0; color: #cbd5e1; }
    .product-id { background: #dbeafe; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .product-id strong { color: #2563eb; font-size: 24px; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px; }
    .field { background: #f8fafc; padding: 15px; margin-bottom: 10px; border-radius: 6px; }
    .field-label { font-weight: bold; color: #475569; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
    .field-value { color: #1e293b; font-size: 16px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Product Report</h1>
    <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  
  <div class="product-id">
    <div class="field-label">Product ID</div>
    <strong>${productId}</strong>
  </div>
  
  <div class="section">
    <h2>Basic Information</h2>
    <div class="field">
      <div class="field-label">Product Title</div>
      <div class="field-value">${productData.title || 'N/A'}</div>
    </div>
    <div class="grid">
      <div class="field">
        <div class="field-label">SKU</div>
        <div class="field-value">${productData.sku || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="field-label">Category</div>
        <div class="field-value">${productData.category || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="field-label">Price</div>
        <div class="field-value">${productData.price || '0.00'}</div>
      </div>
    </div>
  </div>
  
  ${productData.weight_kg || productData.is_fragile || productData.dimensions ? `
  <div class="section">
    <h2>Physical Properties</h2>
    <div class="grid">
      ${productData.weight_kg ? `
      <div class="field">
        <div class="field-label">Weight</div>
        <div class="field-value">${productData.weight_kg} kg</div>
      </div>` : ''}
      ${productData.is_fragile ? `
      <div class="field">
        <div class="field-label">Fragile</div>
        <div class="field-value">${productData.is_fragile}</div>
      </div>` : ''}
    </div>
    ${productData.dimensions ? `
    <div class="field">
      <div class="field-label">Dimensions (L x W x H)</div>
      <div class="field-value">${productData.dimensions}</div>
    </div>` : ''}
  </div>` : ''}
  
  <div class="section">
    <h2>Warranty & Support</h2>
    <div class="grid">
      <div class="field">
        <div class="field-label">Warranty Period</div>
        <div class="field-value">${productData.warranty_years || 0} years</div>
      </div>
      <div class="field">
        <div class="field-label">Support Features</div>
        <div class="field-value">${Array.isArray(productData.support_features) ? productData.support_features.join(', ') : 'None'}</div>
      </div>
    </div>
  </div>
  
  ${productData.description ? `
  <div class="section">
    <h2>Description</h2>
    <div class="field">
      <div class="field-value">${productData.description}</div>
    </div>
  </div>` : ''}
  
  <div class="footer">
    <p>This is an official product report generated by the Product Management System</p>
  </div>
</body>
</html>`;
    return content;
  };

  const handleDownload = async () => {
    if (!productId.trim()) {
      setError("Product ID is missing");
      return;
    }

    setIsDownloading(true);
    setError("");

    try {
      // Generate HTML content
      const htmlContent = generatePDFContent();
      
      // Create a blob from the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Product_Report_${productId}.html`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      setTimeout(() => {
        alert('✓ Product report downloaded successfully!');
      }, 100);
      
    } catch (err: any) {
      setError(err.message || "Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(", ") || "None";
    }
    return value?.toString() || "N/A";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading PDF preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Product PDF Report</h1>
                <p className="text-slate-300">Preview and download your product report</p>
              </div>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Product ID Display */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Product ID</p>
                  <p className="text-2xl font-bold text-blue-600">{productId || "Not Available"}</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* PDF Preview */}
            <div className="border-2 border-slate-300 rounded-lg overflow-hidden mb-6">
              <div className="bg-slate-800 px-6 py-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">PDF Preview</h2>
                <span className="text-sm text-slate-400">Generated Report</span>
              </div>
              
              <div className="bg-white p-8 max-h-96 overflow-y-auto">
                {productData ? (
                  <div className="space-y-6">
                    {/* Product Title */}
                    <div className="border-b border-slate-200 pb-4">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        {productData.title || "Untitled Product"}
                      </h3>
                      <p className="text-sm text-slate-500">SKU: {formatValue(productData.sku)}</p>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Category</p>
                        <p className="text-lg text-slate-800">{formatValue(productData.category)}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-slate-600 mb-1">Price</p>
                        <p className="text-lg text-slate-800">${formatValue(productData.price)}</p>
                      </div>
                    </div>

                    {/* Physical Properties */}
                    {(productData.weight_kg || productData.is_fragile || productData.dimensions) && (
                      <div>
                        <h4 className="text-lg font-semibold text-slate-700 mb-3">Physical Properties</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {productData.weight_kg && (
                            <div className="bg-slate-50 p-4 rounded-lg">
                              <p className="text-sm font-semibold text-slate-600 mb-1">Weight</p>
                              <p className="text-lg text-slate-800">{productData.weight_kg} kg</p>
                            </div>
                          )}
                          {productData.is_fragile && (
                            <div className="bg-slate-50 p-4 rounded-lg">
                              <p className="text-sm font-semibold text-slate-600 mb-1">Fragile</p>
                              <p className="text-lg text-slate-800">{productData.is_fragile}</p>
                            </div>
                          )}
                          {productData.dimensions && (
                            <div className="bg-slate-50 p-4 rounded-lg col-span-2">
                              <p className="text-sm font-semibold text-slate-600 mb-1">Dimensions</p>
                              <p className="text-lg text-slate-800">{formatValue(productData.dimensions)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Warranty & Support */}
                    <div>
                      <h4 className="text-lg font-semibold text-slate-700 mb-3">Warranty & Support</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-slate-600 mb-1">Warranty Period</p>
                          <p className="text-lg text-slate-800">{formatValue(productData.warranty_years)} years</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-slate-600 mb-1">Support Features</p>
                          <p className="text-slate-800">{formatValue(productData.support_features)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {productData.description && (
                      <div>
                        <h4 className="text-lg font-semibold text-slate-700 mb-3">Description</h4>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <p className="text-slate-700 leading-relaxed">{productData.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No product data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-start gap-2 mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-red-600 font-medium">{error}</span>
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading || !productId}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-md font-semibold text-white shadow-md transition-all ${
                isDownloading || !productId
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Downloading PDF...
                </>
              ) : (
                <>
                  <FileDown className="w-5 h-5" />
                  Download PDF Report
                </>
              )}
            </button>

            {/* Action Links */}
            <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-300">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                ← Create Another Product
              </a>
              <button
                onClick={() => window.print()}
                className="text-slate-600 hover:text-slate-700 font-medium text-sm transition-colors"
              >
                🖨️ Print Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}