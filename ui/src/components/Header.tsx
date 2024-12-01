"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; 
import { jwtDecode } from "jwt-decode"; 
import { useRouter } from "next/navigation";
import { DecodedToken } from "@/app/interfaces/DecodedToken";

const Header = ({ isLoginPage }: { isLoginPage: boolean }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const pathname = usePathname(); 
  const router = useRouter(); 

  useEffect(() => {
    const fetchUserName = async (id: number) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
      }
      try {
        const response = await fetch(`http://localhost:3000/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          setUserName(user.name);
        } else {
          localStorage.clear();
          router.push("register");
        }
      } catch (error) {
        console.error("Erro ao conectar ao servidor:", error);
      }
    };

    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.sub) {
          fetchUserName(decoded.sub);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  const isProfilePage = pathname === "/profile"; 

  return (
    <header className="w-full p-4 bg-green-fresh text-white flex justify-between items-center shadow-md">
      <Link href="/login" className="text-2xl font-bold">
        FlavorForge
      </Link>
      <div className="flex items-center gap-3">
        {userName ? (
          <>
            <div className="text-sm">
              Bem-vindo, <span className="font-semibold">{userName}</span>
            </div>
            <Link
              href={isProfilePage ? "/dashboard" : "/profile"}
              className="px-3 py-1.5 bg-yellow-400 text-black text-xs rounded-md shadow hover:bg-yellow-500 transition-all duration-200"
            >
              {isProfilePage ? "Dashboard" : "Perfil"}
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-md shadow hover:bg-red-700 transition-all duration-200"
            >
              Logout
            </button>
          </>
        ) : isLoginPage ? (
          <Link
            href="/register"
            className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-md shadow hover:bg-blue-600 transition-all duration-200"
          >
            Cadastre-se
          </Link>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-md shadow hover:bg-green-600 transition-all duration-200"
          >
            Faça login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
