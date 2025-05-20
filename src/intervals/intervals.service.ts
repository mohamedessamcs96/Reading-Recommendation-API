// src/intervals/intervals.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntervalDto } from './dto/create-interval.dto';

@Injectable()
export class IntervalsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateIntervalDto) {
    if (dto.start_page >= dto.end_page) {
      throw new Error('Start page must be less than end page');
    }

    await this.prisma.readingInterval.create({
      data: {
        userId: dto.user_id,
        bookId: dto.book_id,
        startPage: dto.start_page,
        endPage: dto.end_page,
      },
    });

    return { status_code: 'success' };
  }
}
