// src/intervals/intervals.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { IntervalsService } from './intervals.service';
import { CreateIntervalDto } from './dto/create-interval.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuardFactory } from '../auth/roles.guard';

@Controller('intervals')
export class IntervalsController {
  constructor(private readonly intervalsService: IntervalsService) {}

  @UseGuards(JwtAuthGuard, RolesGuardFactory(['user', 'admin']))
  @Post()
  create(@Body() dto: CreateIntervalDto, @Request() req) {
    const userId = Number(req.user.userId); // Extract from token and convert to number

    return this.intervalsService.create({
      userId,
      bookId: dto.bookId,
      startPage: dto.startPage,
      endPage: dto.endPage,
    });
  }
}
