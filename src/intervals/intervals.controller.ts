// src/intervals/intervals.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IntervalsService } from './intervals.service';
import { CreateIntervalDto } from './dto/create-interval.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuardFactory } from '../auth/roles.guard';

@Controller('intervals')
export class IntervalsController {
  private readonly logger = new Logger(IntervalsController.name);

  constructor(private readonly intervalsService: IntervalsService) {}

  @UseGuards(JwtAuthGuard, RolesGuardFactory(['user', 'admin']))
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() dto: CreateIntervalDto, @Request() req: any) {
    const userId = Number(req.user.userId);

    try {
      return await this.intervalsService.create({
        userId,
        bookId: dto.bookId,
        startPage: dto.startPage,
        endPage: dto.endPage,
      });
    } catch (error) {
      // Re-throw known error types to preserve their response status
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // Log unexpected errors
      this.logger.error(
        'Unexpected error in IntervalsController.create:',
        error.stack || error.message,
      );

      // Generic fallback
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the reading interval.',
      );
    }
  }
}
