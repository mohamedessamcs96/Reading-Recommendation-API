// src/books/books.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuardFactory } from '../auth/roles.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Admin only can create books
  @UseGuards(JwtAuthGuard, RolesGuardFactory(['admin']))
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createBook(@Body() dto: CreateBookDto) {
    try {
      return await this.booksService.createBook(dto);
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to create book');
    }
  }

  // Both users and admins can get recommended books
  @UseGuards(JwtAuthGuard, RolesGuardFactory(['user', 'admin']))
  @Get('recommended')
  async getTopBooks() {
    try {
      return await this.booksService.getTopBooks();
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to fetch recommended books');
    }
  }
}
