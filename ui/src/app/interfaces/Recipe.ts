export interface Recipe {
  id: string;
  name: string;
  ingredients: string; 
  instructions: string;
  prepTime: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
  is_deleted: boolean;
  created_at: string;
}


