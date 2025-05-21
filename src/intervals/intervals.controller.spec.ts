import { Test, TestingModule } from '@nestjs/testing';
import { IntervalsService } from './intervals.service';
import { PrismaService } from '../prisma/prisma.service';

describe('IntervalsService', () => {
  let service: IntervalsService;

  //  Mock PrismaService
  const mockPrisma = {
    interval: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    book: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an interval', async () => {
    // Mock book and user existence
    mockPrisma.book.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });

    const mockCreated = {
      id: 1,
      userId: 1,
      bookId: 1,
      startPage: 10,
      endPage: 20,
    };

    mockPrisma.interval.create.mockResolvedValue(mockCreated);

    const result = await service.create({
      userId: 1,
      bookId: 1,
      startPage: 10,
      endPage: 20,
    });

    expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockPrisma.interval.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        bookId: 1,
        startPage: 10,
        endPage: 20,
      },
    });

    expect(result).toEqual(mockCreated);
  });
});
