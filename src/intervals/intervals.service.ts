// src/intervals/intervals.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class IntervalsService {
  private readonly logger = new Logger(IntervalsService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: number;
    bookId: number;
    startPage: number;
    endPage: number;
  }) {
    const { userId, bookId, startPage, endPage } = data;

    // 1. Defensive check for undefined/null
    if (
      userId === undefined ||
      bookId === undefined ||
      startPage === undefined ||
      endPage === undefined
    ) {
      throw new BadRequestException(
        'All fields (userId, bookId, startPage, endPage) are required.',
      );
    }

    // 2. Validate page range
    if (startPage >= endPage) {
      throw new BadRequestException(
        'Start page must be less than end page.',
      );
    }

    // 3. Check if the book exists
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found.`);
    }

    // 4. Validate endPage does not exceed total number of pages
    if (endPage > book.numOfPages) {
      throw new BadRequestException(
        `End page (${endPage}) cannot be greater than the book's total pages (${book.numOfPages}).`,
      );
    }

    // 5. Attempt to create the reading interval
    try {
      const interval = await this.prisma.readingInterval.create({
        data: {
          startPage,
          endPage,
          bookId,
          userId,
        },
      });

      this.logger.log(
        `Interval created: User ${userId}, Book ${bookId}, Pages ${startPage}-${endPage}`,
      );

      return interval;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        throw new BadRequestException(`Database error: ${error.message}`);
      }

      this.logger.error(
        'Unexpected error creating reading interval',
        error.stack || error.message,
      );

      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the reading interval.',
      );
    }
  }
}
