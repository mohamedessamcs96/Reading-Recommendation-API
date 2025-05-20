import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IntervalsModule } from './intervals/intervals.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [AuthModule, UsersModule, IntervalsModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
