import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
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
  createBook(@Body() dto: CreateBookDto) {
    return this.booksService.createBook(dto);
  }

  // Both users and admins can get recommended books
  @UseGuards(JwtAuthGuard, RolesGuardFactory(['user', 'admin']))
  @Get('recommended')
  getTopBooks() {
    return this.booksService.getTopBooks();
  }
}
