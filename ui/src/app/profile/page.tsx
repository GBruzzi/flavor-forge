"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Title from "../../components/Title";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { DecodedToken } from "../interfaces/DecodedToken";

const Profile = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.sub) {
          fetchUserData(decoded.sub);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchUserData = async (id: number) => {
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
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    setNewName(userName || "");
    setNewEmail(userEmail || "");
  };

  const handleSave = async () => {
    if (newName && newEmail) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const decoded: DecodedToken = jwtDecode(token);

        const updatedUser = { name: newName, email: newEmail };

        const response = await fetch(
          `http://localhost:3000/user/${decoded.sub}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedUser),
          }
        );

        if (response.ok) {
          setUserName(newName);
          setUserEmail(newEmail);
          setIsEditing(false);
        } else {
          console.error("Erro ao salvar alterações:", await response.text());
        }
      } catch (error) {
        console.error("Erro ao salvar alterações:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir sua conta?")) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const decoded: DecodedToken = jwtDecode(token);

        const response = await fetch(
          `http://localhost:3000/user/${decoded.sub}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          alert("Conta excluída com sucesso.");
          localStorage.removeItem("authToken");
          router.push("/login");
        } else {
          console.error("Erro ao excluir a conta:", await response.text());
        }
      } catch (error) {
        console.error("Erro ao excluir a conta:", error);
      }
    }
  };

  return (
    <>
      <Header isLoginPage={false} />
      <div className="bg-[#f3f4f6] h-[450px]">
        <div className="max-w-4xl mx-auto p-6">
          <Title
            text="Perfil do Usuário"
            fontSize="text-3xl"
            color="#f8b400"
            marginBottom="mb-6"
            textAlign="text-center"
          />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <button
              onClick={handleDelete}
              className="bg-[#ff7f32] text-white py-2 px-4 rounded-md mb-6 hover:bg-red-600 transition-all duration-200"
            >
              Excluir Conta
            </button>

            {isEditing ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-[#4b4b4b]">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2 border rounded-md border-[#a4e4b2]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-[#4b4b4b]">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 border rounded-md border-[#a4e4b2]"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="bg-[#6dbf6d] text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200"
                >
                  Salvar Alterações
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-[#4b4b4b]">
                    Nome: {userName}
                  </h2>
                  <p className="text-sm text-gray-600">E-mail: {userEmail}</p>
                </div>
                <button
                  onClick={handleEdit}
                  className="text-[#ff7f32] hover:text-orange-500 transition-all duration-200"
                >
                  Editar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
