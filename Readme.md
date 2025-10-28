# 🧾 Product Report Generator (Next.js + Node.js + Prisma)

A full-stack web application that allows users to **register, log in**, fill out a **dynamic product details form**, and automatically **generate PDF-based product reports**.  
It demonstrates structured data collection, conditional logic (e.g., “Is product fragile?”), and transparent report generation.

---

## ⚙️ Setup Instructions

### 🧠 Backend Setup (Node.js + Express + Prisma)

```bash
cd backend
npm install
Create a .env file inside the backend folder:

env
Copy code
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<dbname>"
Then run Prisma setup:

bash
Copy code
npx prisma migrate dev
npx prisma generate
Start the backend server:

bash
Copy code
npm run dev
Server runs at → http://localhost:4000

💻 Frontend Setup (Next.js)
bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs at → http://localhost:3000

🚀 Feature List
🔐 Authentication
Register and log in using email and password

Token stored in local storage for secure authenticated access

Simple, user-friendly toggle between Login and Register

📦 Product Form & Conditional Logic
Dynamic form where users can input product details

Conditional field handling (e.g., “Is product fragile?” → triggers more inputs)

Real-time validation for form accuracy

🧾 PDF Report Generation
Automatically generates product-specific PDF reports

Stores report metadata and file path in the database

Enables download and future access

🧱 Database Schema (Prisma + PostgreSQL)
User: Authentication and ownership

Product: Core product metadata

Question: Dynamic form schema with type and conditional rules

ProductAnswer: Stores user responses per question

Report: Stores generated report data and PDF path

🤖 AI Service Documentation
While this project doesn’t use AI for inference or model-based predictions, AI tools were used for assisted development, documentation structuring, and schema refinement.

The AI’s role included:

Auto-generating conditional form logic templates

Suggesting database relationships between models

Helping design a transparent and modular backend architecture

Enhancing error handling patterns for cleaner REST APIs

These AI-driven insights accelerated development while maintaining human-driven design intent and transparency.

🧩 Sample Product Entry
Example Product Submission
POST /product

json
Copy code
{
  "title": "Glass Vase",
  "sku": "GV123",
  "answers": [
    { "questionKey": "fragile", "answer": "Yes" },
    { "questionKey": "handling_instructions", "answer": "Use bubble wrap and handle with care" },
    { "questionKey": "storage_conditions", "answer": "Keep in a padded box" }
  ]
}
Example Generated Report (PDF Summary)
Field	Value
Product Name	Glass Vase
SKU	GV123
Is Fragile	Yes
Handling Instructions	Use bubble wrap and handle with care
Storage Conditions	Keep in a padded box
Report Generated On	2025-10-27

🧠 Reflection
This project was developed with the assistance of AI-based tools like ChatGPT for ideation, architecture refinement, and documentation formatting. AI helped structure complex database relationships and generate clean, modular Express route handlers, significantly reducing boilerplate and human error.

From an architectural standpoint, the system follows clear separation of concerns — authentication, product management, and PDF generation exist as independent modules, unified through REST APIs. The frontend focuses on user experience and dynamic rendering, while the backend ensures integrity, traceability, and data transparency through Prisma and PostgreSQL.

For product transparency, the logic emphasizes data lineage — each product report can be traced back to its original form responses. This ensures that users understand what data contributed to the final PDF, maintaining openness and accountability throughout the process.

