// dto/create-interval.dto.ts
import { IsInt, Min } from 'class-validator';

export class CreateIntervalDto {
  @IsInt({ message: 'bookId must be an integer' })
  @Min(1, { message: 'bookId must be at least 1' })
  bookId: number;

  @IsInt({ message: 'startPage must be an integer' })
  @Min(1, { message: 'startPage must be at least 1' })
  startPage: number;

  @IsInt({ message: 'endPage must be an integer' })
  @Min(1, { message: 'endPage must be at least 1' })
  endPage: number;
}
