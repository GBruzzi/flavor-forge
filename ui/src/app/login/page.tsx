"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "@/components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      localStorage.clear();
      window.location.reload();
    }
    
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json(); // pegar token
        const { token } = data;

        // salvar no localStorage
        localStorage.setItem("authToken", token);

        router.push("/dashboard");
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || "Erro ao realizar login");
      }
    } catch (error) {
      setError("Erro ao realizar login. Tente novamente mais tarde.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header isLoginPage={true} />
        <div className="flex justify-center items-center py-8">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Entrar na sua conta</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
