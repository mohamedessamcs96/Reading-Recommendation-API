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
  // Fetch all books along with their reading intervals
  const books = await this.prisma.book.findMany({
    include: { intervals: true },
  });

  const result = books.map((book) => {
    const uniquePages = new Set<number>();

    // Loop through each interval and collect unique page numbers
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

  // Filter out books with 0 read pages, sort descending, and return top 5
  return result
    .filter(book => book.num_of_read_pages > 0)
    .sort((a, b) => b.num_of_read_pages - a.num_of_read_pages)
    .slice(0, 5);
}

}
