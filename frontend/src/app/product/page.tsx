"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, FileText } from "lucide-react";

// Type definitions
type QuestionType = "TEXT" | "NUMBER" | "SELECT" | "RADIO" | "CHECKBOX";

interface Question {
  id: string;
  key: string;
  label: string;
  type: QuestionType;
  step: number;
  options?: string[];
  validation?: {
    required?: boolean;
    minLength?: number;
    min?: number;
    max?: number;
  };
  conditional?: {
    key: string;
    values: string[];
  };
}

interface FormData {
  [key: string]: string | number | string[] | undefined;
}

interface Errors {
  [key: string]: string;
}

// Define question structure
const QUESTIONS: Question[] = [
  // Step 1: Basic Information
  {
    id: "1",
    key: "title",
    label: "Product Title",
    type: "TEXT",
    step: 1,
    validation: { required: true, minLength: 3 },
  },
  {
    id: "2",
    key: "sku",
    label: "SKU (Stock Keeping Unit)",
    type: "TEXT",
    step: 1,
    validation: { required: false },
  },
  {
    id: "3",
    key: "category",
    label: "Product Category",
    type: "SELECT",
    step: 1,
    options: ["Electronics", "Clothing", "Food", "Furniture", "Other"],
    validation: { required: true },
  },

  // Step 2: Physical Properties
  {
    id: "4",
    key: "weight_kg",
    label: "Weight (kg)",
    type: "NUMBER",
    step: 2,
    validation: { required: true, min: 0 },
    conditional: { key: "category", values: ["Electronics", "Furniture"] },
  },
  {
    id: "5",
    key: "is_fragile",
    label: "Is the product fragile?",
    type: "RADIO",
    step: 2,
    options: ["Yes", "No"],
    validation: { required: true },
  },
  {
    id: "6",
    key: "dimensions",
    label: "Dimensions (L x W x H in cm)",
    type: "TEXT",
    step: 2,
    validation: { required: false },
    conditional: { key: "is_fragile", values: ["Yes"] },
  },

  // Step 3: Warranty & Support
  {
    id: "7",
    key: "warranty_years",
    label: "Warranty Period (years)",
    type: "NUMBER",
    step: 3,
    validation: { required: true, min: 0, max: 10 },
  },
  {
    id: "8",
    key: "support_features",
    label: "Support Features",
    type: "CHECKBOX",
    step: 3,
    options: ["24/7 Support", "Email Support", "Phone Support", "Live Chat"],
    validation: { required: false },
  },

  // Step 4: Additional Details
  {
    id: "9",
    key: "description",
    label: "Product Description",
    type: "TEXT",
    step: 4,
    validation: { required: true, minLength: 10 },
  },
  {
    id: "10",
    key: "price",
    label: "Price (USD)",
    type: "NUMBER",
    step: 4,
    validation: { required: true, min: 0 },
  },
];

const TOTAL_STEPS = 4;

export default function ProductPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (submitSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (submitSuccess && countdown === 0) {
      // Store product ID and redirect to PDF page
      sessionStorage.setItem('productId', productId);
      sessionStorage.setItem('productData', JSON.stringify(formData));
      window.location.href = "/pdf";
    }
  }, [submitSuccess, countdown, productId, formData]);

  const getVisibleQuestions = (step: number): Question[] => {
    return QUESTIONS.filter((q) => {
      if (q.step !== step) return false;
      if (q.conditional) {
        const conditionValue = formData[q.conditional.key];
        return q.conditional.values.includes(String(conditionValue));
      }
      return true;
    });
  };

  const currentStepQuestions = getVisibleQuestions(currentStep);

  const validateField = (question: Question, value: any): string | null => {
    const validation = question.validation || {};

    if (
      validation.required &&
      (!value || value === "" || (Array.isArray(value) && value.length === 0))
    ) {
      return `${question.label} is required`;
    }

    if (
      question.type === "TEXT" &&
      validation.minLength &&
      value &&
      value.length < validation.minLength
    ) {
      return `${question.label} must be at least ${validation.minLength} characters`;
    }

    if (question.type === "NUMBER" && value) {
      const num = parseFloat(value);
      if (isNaN(num)) return `${question.label} must be a valid number`;
      if (validation.min !== undefined && num < validation.min) {
        return `${question.label} must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && num > validation.max) {
        return `${question.label} must be at most ${validation.max}`;
      }
    }

    return null;
  };

  const validateStep = (): boolean => {
    const newErrors: Errors = {};
    currentStepQuestions.forEach((q) => {
      const error = validateField(q, formData[q.key]);
      if (error) newErrors[q.key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key: string, value: string | number | string[]): void => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);

    try {
      // Simulate API call to create product
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const generatedId = `PROD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setProductId(generatedId);
      console.log("Product created:", formData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoNow = () => {
    sessionStorage.setItem('productId', productId);
    sessionStorage.setItem('productData', JSON.stringify(formData));
    window.location.href = "/pdf";
  };

  const renderField = (question: Question) => {
    const value = formData[question.key] || "";
    const error = errors[question.key];

    switch (question.type) {
      case "TEXT":
        return (
          <div key={question.id}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {question.label}
              {question.validation?.required && (
                <span className="text-red-600 ml-1">*</span>
              )}
            </label>
            <input
              type="text"
              value={String(value)}
              onChange={(e) => handleInputChange(question.key, e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none transition-colors bg-white text-slate-900 placeholder:text-slate-400 ${
                error ? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-blue-600"
              }`}
              placeholder={`Enter ${question.label.toLowerCase()}`}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
        );

      case "NUMBER":
        return (
          <div key={question.id}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {question.label}
              {question.validation?.required && (
                <span className="text-red-600 ml-1">*</span>
              )}
            </label>
            <input
              type="number"
              value={value === "" ? "" : Number(value)}
              onChange={(e) => handleInputChange(question.key, e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none transition-colors bg-white text-slate-900 placeholder:text-slate-400 ${
                error ? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-blue-600"
              }`}
              placeholder={`Enter ${question.label.toLowerCase()}`}
              min={question.validation?.min}
              max={question.validation?.max}
              step="0.01"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
        );

      case "SELECT":
        return (
          <div key={question.id}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {question.label}
              {question.validation?.required && (
                <span className="text-red-600 ml-1">*</span>
              )}
            </label>
            <select
              value={String(value)}
              onChange={(e) => handleInputChange(question.key, e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none transition-colors bg-white text-slate-900 ${
                error ? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-blue-600"
              }`}
            >
              <option value="">Select an option</option>
              {question.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
        );

      case "RADIO":
        return (
          <div key={question.id}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {question.label}
              {question.validation?.required && (
                <span className="text-red-600 ml-1">*</span>
              )}
            </label>
            <div className="space-y-2">
              {question.options?.map((opt) => (
                <label key={opt} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={question.key}
                    value={opt}
                    checked={String(value) === opt}
                    onChange={(e) => handleInputChange(question.key, e.target.value)}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span className="text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
        );

      case "CHECKBOX":
        return (
          <div key={question.id}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {question.label}
              {question.validation?.required && (
                <span className="text-red-600 ml-1">*</span>
              )}
            </label>
            <div className="space-y-2">
              {question.options?.map((opt) => (
                <label key={opt} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={Array.isArray(value) && value.includes(opt)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, opt]
                        : currentValues.filter((v) => v !== opt);
                      handleInputChange(question.key, newValues);
                    }}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span className="text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-slate-800 p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Success!</h1>
              <p className="text-slate-300">Product created successfully</p>
            </div>

            <div className="p-8 text-center">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600 mb-2">Product ID</p>
                <p className="text-xl font-bold text-blue-600">{productId}</p>
              </div>

              <p className="text-slate-600 mb-2">
                Generating your PDF report...
              </p>
              
              <div className="bg-slate-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-500 mb-2">Auto-redirecting in</p>
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{countdown}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoNow}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all shadow-md mb-3"
              >
                Generate PDF Now
              </button>

              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setCurrentStep(1);
                  setFormData({});
                  setErrors({});
                  setCountdown(5);
                }}
                className="w-full py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-md hover:bg-slate-50 transition-all"
              >
                Create Another Product
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create New Product</h1>
            <p className="text-slate-300 mb-4">
              Step {currentStep} of {TOTAL_STEPS}
            </p>

            {/* Progress Bar */}
            <div className="bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              />
            </div>

            {/* Step Labels */}
            <div className="flex justify-between mt-3 text-sm">
              <span className={currentStep === 1 ? "font-semibold text-blue-400" : "text-slate-400"}>
                Basic Info
              </span>
              <span className={currentStep === 2 ? "font-semibold text-blue-400" : "text-slate-400"}>
                Physical
              </span>
              <span className={currentStep === 3 ? "font-semibold text-blue-400" : "text-slate-400"}>
                Warranty
              </span>
              <span className={currentStep === 4 ? "font-semibold text-blue-400" : "text-slate-400"}>
                Details
              </span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="space-y-5">{currentStepQuestions.map(renderField)}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 mt-6 border-t border-slate-300">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-md font-semibold transition-all ${
                  currentStep === 1
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Previous
              </button>

              {currentStep < TOTAL_STEPS ? (
                <button
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all shadow-md"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex items-center px-6 py-3 rounded-md font-semibold text-white shadow-md transition-all ${
                    isSubmitting
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Submit Product
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}