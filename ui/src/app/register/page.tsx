"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Form from "../../components/Form";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter(); 

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      localStorage.clear();
      window.location.reload();
    }
    
  }, []);

  const handleSubmit = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    setError(null); // reset erro
    setSuccess(null); // reset sucesso

    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setSuccess("Usuário criado com sucesso!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao criar usuário");
      }
    } catch (error) {
      setError("Erro de conexão com o servidor");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header isLoginPage={false} />
        <div className="flex justify-center items-center py-8">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Criar uma conta</h2>
            {success && <p className="text-green-500 mb-4">{success}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Form
              fields={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              onSubmit={handleSubmit}
              error={error}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;
