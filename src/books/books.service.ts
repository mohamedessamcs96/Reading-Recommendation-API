// src/books/books.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(private prisma: PrismaService) {}

  async createBook(dto: CreateBookDto) {
    if (!dto.name || !dto.numOfPages || dto.numOfPages < 1) {
      throw new BadRequestException('Invalid book data provided.');
    }

    try {
      const createdBook = await this.prisma.book.create({
        data: {
          name: dto.name,
          numOfPages: dto.numOfPages,
        },
      });

      this.logger.log(`Created book: ${createdBook.name} with ${createdBook.numOfPages} pages`);
      return createdBook;
    } catch (err) {
      this.logger.error('Error creating book', err.stack);
      throw new BadRequestException('Could not create book');
    }
  }

  async getTopBooks() {
    try {
      const books = await this.prisma.book.findMany({
        include: { intervals: true },
      });

      this.logger.log(`Fetched ${books.length} books with intervals`);

      const result = books.map((book) => {
        const uniquePages = new Set<number>();
        for (const interval of book.intervals) {
          for (let page = interval.startPage; page <= interval.endPage; page++) {
            uniquePages.add(page);
          }
        }

        return {
          book_id: book.id,
          book_name: book.name,
          num_of_pages: book.numOfPages,
          num_of_read_pages: uniquePages.size,
        };
      });

      const topBooks = result
        .filter(book => book.num_of_read_pages > 0)
        .sort((a, b) => b.num_of_read_pages - a.num_of_read_pages)
        .slice(0, 5);

      this.logger.log(`Returning top ${topBooks.length} books based on unique pages read`);

      return topBooks;
    } catch (err) {
      this.logger.error('Error fetching top books', err.stack);
      throw new BadRequestException('Could not fetch top books');
    }
  }
}
