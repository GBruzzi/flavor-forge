import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { User } from '../user/entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockUser: User = {
  id: 0,
  name: 'user name',
  email: 'username@mail.com',
  password: '123',
  recipes: [],
  createdAt: new Date(),
};

const mockCreateRecipeDto: CreateRecipeDto = {
  name: 'Receita Teste',
  ingredients: 'Ingrediente 1, Ingrediente 2',
  instructions: 'Instrução 1, Instrução 2',
  prepTime: 20,
  difficulty: "Fácil"
};

const mockRecipe: Recipe = {
  id: 0,
  name: 'Receita Teste',
  ingredients: 'Ingrediente 1, Ingrediente 2',
  instructions: 'Instrução 1, Instrução 2',
  prepTime: 20,
  difficulty: "Fácil",
  user: mockUser,
  createdAt: new Date(),
  deletedAt: null, 
};

const defaultUserRepositoryMock = {
  findOne: jest.fn().mockResolvedValue(mockUser),
};

const defaultRecipeRepositoryMock = {
  save: jest.fn().mockResolvedValue(mockRecipe),
  create: jest.fn().mockResolvedValue({ ...mockCreateRecipeDto, user: mockUser }),
  findOneOrFail: jest.fn().mockResolvedValue(mockRecipe),
  softDelete: jest.fn().mockResolvedValue(undefined),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(1),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockRecipe]),
  }),
};

const setupTestingModule = (
  userRepositoryMock: typeof defaultUserRepositoryMock,
  recipeRepositoryMock: typeof defaultRecipeRepositoryMock,
) => {
  return Test.createTestingModule({
    providers: [
      RecipeService,
      {
        provide: getRepositoryToken(Recipe),
        useValue: recipeRepositoryMock,
      },
      {
        provide: getRepositoryToken(User),
        useValue: userRepositoryMock,
      },
    ],
  }).compile();
};

describe('RecipeService', () => {
  let service: RecipeService;

  beforeEach(async () => {
    const module: TestingModule = await setupTestingModule(
      defaultUserRepositoryMock,
      defaultRecipeRepositoryMock,
    );

    service = module.get<RecipeService>(RecipeService);
  });

  it('Deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('Deve criar uma receita com sucesso', async () => {
      const recipe = await service.create(0, mockCreateRecipeDto);
      expect(recipe).toEqual(mockRecipe);
    });

    it('Deve lançar uma exceção NotFoundException se o usuário não for encontrado', async () => {
      const userRepositoryMock = {
        findOne: jest.fn().mockResolvedValue(null), // Simula usuário não encontrado
      };

      const module: TestingModule = await setupTestingModule(
        userRepositoryMock,
        defaultRecipeRepositoryMock,
      );
      const serviceWithNotFoundException = module.get<RecipeService>(RecipeService);

      const recipe = serviceWithNotFoundException.create(1, mockCreateRecipeDto);
      await expect(recipe).rejects.toThrow(NotFoundException);
    });
  });


  describe('findOne()', () => {
    it('Deve retornar uma receita pelo ID', async () => {
      const recipe = await service.findOne(0);
      expect(recipe).toEqual(mockRecipe);
    });

    it('Deve lançar uma exceção NotFoundException se a receita não for encontrada', async () => {
      defaultRecipeRepositoryMock.findOneOrFail.mockRejectedValueOnce(
        new NotFoundException('Receita não encontrada'),
      );
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('Deve remover uma receita com sucesso', async () => {
      const result = await service.remove(0);
      expect(result).toBe(true);
    });
  });
});
