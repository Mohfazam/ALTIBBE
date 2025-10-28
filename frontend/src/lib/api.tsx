// lib/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://altibbebackend.vercel.app/", 
});

export const registerUser = (email: string, password: string) =>
  API.post("/auth/register", { email, password });

export const loginUser = (email: string, password: string) =>
  API.post("/auth/login", { email, password });

export const createProduct = (data: any, token: string) =>
  API.post("/product", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const generatePDF = (productId: string) =>
  API.post(`/pdf/${productId}`, {}, { responseType: "blob" });
