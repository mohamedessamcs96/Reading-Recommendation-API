import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IntervalsModule } from './intervals/intervals.module';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, 
    UsersModule,
    IntervalsModule, 
    BooksModule,
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
