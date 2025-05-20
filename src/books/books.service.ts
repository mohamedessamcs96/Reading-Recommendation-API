import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async createBook(dto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        name: dto.name,
        numOfPages: dto.numOfPages,
      },
    });
  }

  async getTopBooks() {
    const books = await this.prisma.book.findMany({
      include: { intervals: true },
    });

    const result = books.map((book) => {
      const pages = new Set<number>();
      for (const interval of book.intervals) {
        for (let i = interval.startPage; i <= interval.endPage; i++) {
          pages.add(i);
        }
      }

      return {
        book_id: book.id,
        book_name: book.name,
        num_of_pages: book.numOfPages,
        num_of_read_pages: pages.size,
      };
    });

    return result.sort((a, b) => b.num_of_read_pages - a.num_of_read_pages).slice(0, 5);
  }
}
