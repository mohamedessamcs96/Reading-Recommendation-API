// src/intervals/dto/create-interval.dto.ts
import { IsInt, Min } from 'class-validator';

export class CreateIntervalDto {
  @IsInt()
  bookId: number;

  @IsInt()
  @Min(1)
  startPage: number;

  @IsInt()
  @Min(1)
  endPage: number;
}
