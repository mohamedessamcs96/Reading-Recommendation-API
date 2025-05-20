// src/intervals/dto/create-interval.dto.ts
import { IsInt, Min } from 'class-validator';

export class CreateIntervalDto {
  @IsInt()
  user_id: number;

  @IsInt()
  book_id: number;

  @IsInt()
  @Min(1)
  start_page: number;

  @IsInt()
  @Min(1)
  end_page: number;
}
