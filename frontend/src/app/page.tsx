"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    try {
      const res = isLogin
        ? await loginUser(email, password)
        : await registerUser(email, password);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        alert("Logged in successfully!");
        router.push("/product"); // ✅ Redirect to product page
      } else {
        alert("Registered successfully!");
        setIsLogin(true); // ✅ Switch to login mode
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-semibold">{isLogin ? "Login" : "Register"}</h1>
      <input
        className="border p-2 w-64 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-64 rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAuth}
      >
        {isLogin ? "Login" : "Register"}
      </button>
      <button
        className="text-sm text-gray-600"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Create an account" : "Already have an account?"}
      </button>
    </div>
  );
}
