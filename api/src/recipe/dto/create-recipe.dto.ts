import { 
  IsString, 
  IsOptional, 
  IsInt, 
  IsEnum, 
  MinLength, 
  MaxLength, 
  Min, 
  Max 
} from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @MinLength(3, { message: 'Nome precisa ter pelo menos 3 caracteres' })
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Ingredientes deve ter pelo menos um item' }) 
  @MaxLength(1000, { message: 'Ingredientes deve ter no máximo 1000 itens' }) 
  ingredients: string;

  @IsString()
  @MinLength(10, { message: 'Instruções devem ter pelo menos 10 caracteres' })
  @MaxLength(1000, { message: 'Instruções devem ter no máximo 1000 caracteres' })
  instructions: string;

  @IsInt()
  @Min(1, { message: 'Tempo de preparo deve ser pelo menos 1 minuto' })
  @Max(1440, { message: 'Tempo de preparo deve ser no máximo 1440 minutos (24 hours)' })
  prepTime: number;

  @IsEnum(['Fácil', 'Médio', 'Difícil'], {
    message: 'Dificuldade deve ser uma dessas : Fácil, Médio, Difícil',
  })
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}
