// src/intervals/intervals.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntervalDto } from './dto/create-interval.dto';

@Injectable()
export class IntervalsService {
  constructor(private prisma: PrismaService) {}

// intervals.service.ts
async create(data: {
  userId: number;
  bookId: number;
  startPage: number;
  endPage: number;
}) {
  if (data.startPage >= data.endPage) {
    throw new Error('Start page must be less than end page');
  }

  return await this.prisma.readingInterval.create({
    data: {
      startPage: data.startPage,
      endPage: data.endPage,
      bookId: data.bookId,
      userId: data.userId,
    },
  });
}}
