import { IsEmail, IsString, MinLength, IsOptional, IsIn, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[@$!%*?&])/,
    { message: 'Password must contain at least one special character (@$!%*?&)' })
  password: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: 'user' | 'admin';
}
