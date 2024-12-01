import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

const mockUserDto: CreateUserDto = {
  name: 'User Name',
  email: 'username@mail.com',
  password: 'P@ssw0rd!',
};

const mockUser: User = {
  id: 1,
  name: 'User Name',
  email: 'username@mail.com',
  password: 'P@ssw0rd!',
  recipes: [],
  createdAt: new Date(),
};

const defaultUserRepositoryMock = {
  save: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockReturnValue(mockUser),
  findOne: jest.fn().mockResolvedValue(null),
  update: jest.fn().mockResolvedValue(mockUser),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

const setupTestingModule = (userRepositoryMock: typeof defaultUserRepositoryMock) => {
  return Test.createTestingModule({
    providers: [
      UserService,
      {
        provide: getRepositoryToken(User),
        useValue: userRepositoryMock,
      },
    ],
  }).compile();
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await setupTestingModule(defaultUserRepositoryMock);
    service = module.get<UserService>(UserService);
  });

  it('Deve estar definido', () => {
    expect(service).toBeDefined();
  });


  describe('findOne()', () => {
    it('Deve retornar um usuário existente', async () => {
      defaultUserRepositoryMock.findOne.mockResolvedValueOnce(mockUser);
      const user = await service.findOne(1);
      expect(user).toEqual(mockUser);
    });

    it('Deve lançar NotFoundException se o usuário não for encontrado', async () => {
      defaultUserRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

});
