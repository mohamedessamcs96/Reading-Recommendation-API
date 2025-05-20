// src/users/users.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, username, password, role = 'user' } = createUserDto;

    // Check if email already exists
    const existingEmailUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingEmailUser) {
      throw new BadRequestException('Email already in use');
    }

    // Check if username already exists
    const existingUsernameUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUsernameUser) {
      throw new BadRequestException('Username already taken');
    }

    // Hash password here ONLY
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role, 
      },
      select: {
        id: true,
        username: true,
        role: true,
      }, 
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    console.log('UserService.findOneByUsername:', user);
    return user;
  }
}
