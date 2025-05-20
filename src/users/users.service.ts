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
    const { email, username, password } = createUserDto;

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

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
