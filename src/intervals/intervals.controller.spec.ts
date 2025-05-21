// src/intervals/intervals.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { IntervalsService } from './intervals.service';
import { PrismaService } from '../prisma/prisma.service';

describe('IntervalsService', () => {
  let service: IntervalsService;
  let prisma: PrismaService;

  const mockPrisma = {
    readingInterval: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntervalsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<IntervalsService>(IntervalsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const input = {
      userId: 1,
      bookId: 1,
      startPage: 5,
      endPage: 10,
    };

    it('should create a reading interval successfully', async () => {
      const mockInterval = {
        id: 1,
        ...input,
      };

      mockPrisma.readingInterval.create.mockResolvedValue(mockInterval);

      const result = await service.create(input);

      expect(result).toEqual(mockInterval);
      expect(prisma.readingInterval.create).toHaveBeenCalledWith({
        data: {
          userId: input.userId,
          bookId: input.bookId,
          startPage: input.startPage,
          endPage: input.endPage,
        },
      });
    });

    it('should throw an error if startPage >= endPage', async () => {
      const invalidInput = { ...input, startPage: 10, endPage: 5 };

      await expect(service.create(invalidInput)).rejects.toThrow(
        'Start page must be less than end page',
      );

      expect(prisma.readingInterval.create).not.toHaveBeenCalled();
    });
  });
});
