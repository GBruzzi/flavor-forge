"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Filter from "./components/Filter";
import Title from "../../components/Title";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Recipe } from "../interfaces/Recipe";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../interfaces/DecodedToken";

const Dashboard = () => {
  const [userId, setUserId] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(Number(decoded.sub));
        console.log("ID do usuário:", decoded.sub);
      } catch (err) {
        console.error("Erro ao decodificar o token:", err);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  // buscar as novas receitas após alterações
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [originalRecipes, setOriginalRecipes] = useState([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  const fetchRecipes = async (
    userId: number,
    page: number = 1,
    filter: string = "",
    sort: string = "createdAt",
    order: "ASC" | "DESC" = "ASC"
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      userId = decoded.sub;

      const response = await fetch(
        `http://localhost:3000/myRecipes/${userId}?page=${page}&limit=10&filter=${filter}&sort=${sort}&order=${order}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes);
        setOriginalRecipes(data.recipes);
        setTotalPages(data.totalPages);
      } else if (response.status === 401) {
        setError("Não autorizado. Verifique o token ou faça login novamente.");
        localStorage.clear();
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(`Erro ao buscar receitas: ${response.statusText}`);
      }
    } catch (err) {
      setError("Erro ao carregar receitas. Tente novamente mais tarde.");
    }
  };

  // Criação de receita
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    prepTime: 0,
    difficulty: "Fácil",
  });

  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const handleCreateRecipe = async (userId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        setTimeout(() => setError(undefined), 5000);
        return;
      }

      const recipeToCreate = { ...newRecipe };

      console.log("Dados da receita a ser criada:", recipeToCreate);
      console.log(`Enviando para: http://localhost:3000/myRecipes/${userId}`);

      const response = await fetch(
        `http://localhost:3000/myRecipes/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(recipeToCreate),
        }
      );

      if (response.ok) {
        const newCreatedRecipe = await response.json();
        setRecipes((prevRecipes) => [newCreatedRecipe, ...prevRecipes]);
        setIsCreateModalOpen(false);
        setSuccessMessage("Receita criada com sucesso!");
        setTimeout(() => setSuccessMessage(undefined), 3000);

        setNewRecipe({
          name: "",
          ingredients: "",
          instructions: "",
          prepTime: 0,
          difficulty: "Fácil",
        });

        fetchRecipes(userId, 1, filter);
      } else {
        const errorData = await response.json();
        console.error("Erro ao criar receita:", errorData);

        setError(
          `Erro ao criar receita. Verifique os dados. Detalhes: ${
            errorData.message || response.statusText
          }`
        );
        setTimeout(() => setError(undefined), 5000);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      setError("Erro ao conectar com o servidor.");
    }
  };

  // deletar receitas
  const handleDelete = async (userId: number, recipeId: string) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      userId = decoded.sub;

      const response = await fetch(
        `http://localhost:3000/myRecipes/${userId}/recipe/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.id !== recipeId)
        );
        setSuccessMessage("Receita excluída com sucesso!");
        setTimeout(() => setSuccessMessage(undefined), 3000);
        fetchRecipes(userId, 1, filter);
      } else {
        setError("Erro ao excluir receita. Verifique sua permissão.");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor.");
    }
  };

  // editar receitas
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedIngredients, setEditedIngredients] = useState<string>("");
  const [editedInstructions, setEditedInstructions] = useState<string>("");
  const [editedPrepTime, setEditedPrepTime] = useState<number | undefined>(
    undefined
  );
  const [editedDifficulty, setEditedDifficulty] = useState<
    "Fácil" | "Médio" | "Difícil"
  >("Fácil");

  const handleEditClick = (recipe: Recipe) => {
    setEditRecipe(recipe);
    setEditedName(recipe.name);
    setEditedIngredients(recipe.ingredients || "");
    setEditedInstructions(recipe.instructions || "");
    setEditedPrepTime(recipe.prepTime);
    setEditedDifficulty(recipe.difficulty || "Fácil");
  };

  const handleEditSubmit = async () => {
    if (!editRecipe) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);

      const response = await fetch(
        `http://localhost:3000/myRecipes/${decoded.sub}/recipe/${editRecipe.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editedName,
            ingredients: editedIngredients,
            instructions: editedInstructions,
            prepTime: editedPrepTime,
            difficulty: editedDifficulty,
          }),
        }
      );

      if (response.ok) {
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.id === editRecipe.id
              ? {
                  ...recipe,
                  name: editedName, 
                  ingredients: editedIngredients, 
                  instructions: editedInstructions, 
                  prepTime: editedPrepTime ?? recipe.prepTime, 
                  difficulty: editedDifficulty, 
                  is_deleted: recipe.is_deleted, 
                  created_at: recipe.created_at, 
                }
              : recipe
          )
        );

        setEditRecipe(null);
        setSuccessMessage("Receita atualizada com sucesso!");
        setTimeout(() => setSuccessMessage(undefined), 3000);
      } else {
        setError("Erro ao editar a receita. Verifique sua permissão.");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor.");
    }
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRecipes(userId, page, filter);
  };

  const [filter, setFilter] = useState<string>("");
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleFilterSubmit = () => {
    setCurrentPage(1);
    fetchRecipes(userId, 1, filter);
  };

  const handleSortChange = (newSort: string) => {
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setSort(newSort);
    setOrder(newOrder);
    fetchRecipes(userId, currentPage, filter, newSort, newOrder);
  };

  useEffect(() => {
    fetchRecipes(userId, currentPage, filter);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* header */}
      <Header isLoginPage={false} />

      {/* conteúdo principal */}
      <main className="flex-grow p-8">
        <Title
          text="Minhas receitas"
          fontSize="text-3xl"
          color="#f8b400"
          marginBottom="mb-6"
          textAlign="text-center"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm mb-4">{successMessage}</p>
        )}

        {/* btn criar receita */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            + Criar Receita
          </button>
        </div>

        {/* filtro */}
        <Filter
          filter={filter}
          onFilterChange={handleFilterChange}
          onFilterSubmit={handleFilterSubmit}
        />

        {/* table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-green-fresh text-white">
              <tr>
                <th className="py-3 px-6">
                  Nome
                  <button
                    onClick={() => handleSortChange("name")}
                    className="ml-2 text-xs text-yellow-300 hover:text-yellow-500"
                  >
                    Ordenar{" "}
                    {sort === "name" ? (order === "ASC" ? "↑" : "↓") : "↕"}
                  </button>
                </th>
                <th className="py-3 px-6">Ingredientes</th>
                <th className="py-3 px-6">Instruções</th>
                <th className="py-3 px-6">Tempo de Preparo</th>
                <th className="py-3 px-6">Dificuldade</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(recipes) && recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <tr
                    key={recipe.id}
                    className="hover:bg-gray-200 border-t border-gray-300"
                  >
                    <td className="py-4 px-6">{recipe.name}</td>
                    <td className="py-4 px-6">
                      {recipe.ingredients
                        ? recipe.ingredients
                        : "Não informado"}
                    </td>
                    <td className="py-4 px-6">
                      {recipe.instructions
                        ? recipe.instructions
                        : "Não informado"}
                    </td>
                    <td className="py-4 px-6">
                      {recipe.prepTime
                        ? `${recipe.prepTime} minutos`
                        : "Não informado"}
                    </td>
                    <td className="py-4 px-6">
                      {recipe.difficulty ? recipe.difficulty : "Não informado"}
                    </td>
                    <td className="py-4 px-6 text-center flex justify-center gap-4">
                      <button
                        onClick={() => handleEditClick(recipe)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(userId, recipe.id)}
                        className="text-orange-pumpkin hover:text-orange-pumpkin-dark"
                      >
                        &#x2716;
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Nenhuma receita encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* model edit */}
        {editRecipe && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="text-xl font-bold mb-4">Editar Receita</h2>

              <div className="mb-4">
                <label className="block text-gray-700">Nome</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Ingredientes</label>
                <textarea
                  value={editedIngredients}
                  onChange={(e) => setEditedIngredients(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Instruções</label>
                <textarea
                  value={editedInstructions}
                  onChange={(e) => setEditedInstructions(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  Tempo de Preparo (min)
                </label>
                <input
                  type="number"
                  value={editedPrepTime || ""}
                  onChange={(e) =>
                    setEditedPrepTime(parseInt(e.target.value, 10))
                  }
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Dificuldade</label>
                <select
                  value={editedDifficulty}
                  onChange={(e) =>
                    setEditedDifficulty(
                      e.target.value as "Fácil" | "Médio" | "Difícil"
                    )
                  }
                  className="border w-full px-3 py-2 rounded"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setEditRecipe(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* paginação */}
        <div className="mt-4 flex justify-center items-center gap-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-green-fresh text-white"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* model create */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="text-xl font-bold mb-4">Criar Receita</h2>
              <div className="mb-4">
                <label className="block text-gray-700">Nome</label>
                <input
                  type="text"
                  value={newRecipe.name}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, name: e.target.value })
                  }
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Ingredientes</label>
                <textarea
                  value={newRecipe.ingredients}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, ingredients: e.target.value })
                  }
                  className="border w-full px-3 py-2 rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Instruções</label>
                <textarea
                  value={newRecipe.instructions}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, instructions: e.target.value })
                  }
                  className="border w-full px-3 py-2 rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Tempo de Preparo (min)
                </label>
                <input
                  type="number"
                  value={newRecipe.prepTime || ""}
                  onChange={(e) =>
                    setNewRecipe({
                      ...newRecipe,
                      prepTime: parseInt(e.target.value, 10),
                    })
                  }
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Dificuldade</label>
                <select
                  value={newRecipe.difficulty}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, difficulty: e.target.value })
                  }
                  className="border w-full px-3 py-2 rounded"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleCreateRecipe(userId)}
                  className="bg-green-fresh text-white px-4 py-2 rounded"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
