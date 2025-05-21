// src/users/users.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    try {
      return await this.userService.getUsers();
    } catch (err) {
      throw new BadRequestException('Failed to fetch users');
    }
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to create user');
    }
  }
}
