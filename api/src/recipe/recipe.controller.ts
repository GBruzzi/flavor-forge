import { Controller, Get, Query, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { ParseIntPipe } from '@nestjs/common'; 
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('myRecipes/:userId')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  create(
    @Param('userId', ParseIntPipe) userId: number,  
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    return this.recipeService.create(userId, createRecipeDto);  
  }

  @Get()
findAll(
  @Param('userId', ParseIntPipe) userId: number,
  @Query('page', ParseIntPipe) page = 1,
  @Query('limit', ParseIntPipe) limit = 10,
  @Query('filter') filter = '',
  @Query('sort') sort: string = 'createdAt', // Campo de ordenação padrão
  @Query('order') order: 'ASC' | 'DESC' = 'ASC' // Ordem padrão
) {
  return this.recipeService.findAllByUser(userId, page, limit, filter, sort, order);
}


  @Get('recipe/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipeService.findOne(id);
  }

  @Patch('recipe/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete('recipe/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recipeService.remove(id);
  }
}
