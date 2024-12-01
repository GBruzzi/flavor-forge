import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Recipe } from './entities/recipe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, User]), 
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
