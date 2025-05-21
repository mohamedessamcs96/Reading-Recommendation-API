import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: 1, username: 'testuser' }];
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const users = await service.getUsers();
      expect(users).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    const dto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    it('should throw if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 1 });

      await expect(service.createUser(dto)).rejects.toThrow(BadRequestException);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
    });

    it('should throw if username already exists', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce({ id: 2 }); // username check

      await expect(service.createUser(dto)).rejects.toThrow(BadRequestException);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: dto.username } });
    });

    it('should create a new user with hashed password', async () => {
      // Simulate both email and username are unique
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Properly mock bcrypt.hash to return a string
      const mockHashed = 'mocked_hash_password';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHashed as never); // tells TS to ignore type mismatch

      // Mock the creation response
      const createdUser = {
        id: 1,
        username: dto.username,
        role: 'user',
      };
      mockPrisma.user.create.mockResolvedValue(createdUser);

      const result = await service.createUser(dto);
      expect(result).toEqual(createdUser);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          username: dto.username,
          password: mockHashed,
          role: 'user',
        },
        select: {
          id: true,
          username: true,
          role: true,
        },
      });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOneByEmail(email);
      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';
      const user = { id: 1, username };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOneByUsername(username);
      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username } });
    });
  });
});
