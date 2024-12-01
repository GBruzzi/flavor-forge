import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { User } from '../user/entities/user.entity';


@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe) private recipeRepository: Repository<Recipe>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    userId: number,
    createRecipeDto: CreateRecipeDto,
  ): Promise<Recipe> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  
    const recipe = this.recipeRepository.create({
      ...createRecipeDto,  
      user,  
    });
  
    return this.recipeRepository.save(recipe);
  }
  

  async findAllByUser(
    userId: number,
    page = 1,
    limit = 10,
    filter = '',
    sort = 'createdAt', // ordenar padrão por
    order: 'ASC' | 'DESC' = 'ASC'
  ): Promise<{
    recipes: Recipe[];
    totalRecipes: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
  
    const queryBuilder = this.recipeRepository
      .createQueryBuilder('recipe')
      .where('recipe.deletedAt IS NULL')
      .innerJoinAndSelect('recipe.user', 'u')
      .andWhere('recipe.userId = :userId', { userId });
    if (filter) {
      queryBuilder.andWhere('recipe.name ILIKE :filter', {
        filter: `%${filter}%`,
      });
    }

    queryBuilder.orderBy(`recipe.${sort}`, order);
  
    const totalRecipes = await queryBuilder.getCount();
    const recipes = await queryBuilder.skip(offset).take(limit).getMany();
  
    const formattedRecipes = recipes.map((r) => ({
      ...r,
      user: { id: r.user.id, email: r.user.email, name: r.user.name },
    })) as Recipe[];
  
    const totalPages = Math.ceil(totalRecipes / limit);
  
    return { recipes: formattedRecipes, totalRecipes, totalPages };
  }
  
  

  async findOne(id: number): Promise<Recipe> {
    try {
      return await this.recipeRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Receita com ID ${id} não encontrada`);
    }
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return (await this.recipeRepository.update(id, updateRecipeDto)).raw;
  }

  async remove(id: number): Promise<boolean> {
    await this.recipeRepository.softDelete(id);
    return true;
  }
}
