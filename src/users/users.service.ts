// src/users/users.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      this.logger.log(`Fetched ${users.length} users`);
      return users;
    } catch (err) {
      this.logger.error('Error fetching users', err.stack);
      throw new BadRequestException('Unable to fetch users');
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, username, password, role = 'user' } = createUserDto;

    try {
      // Check if email already exists
      const existingEmailUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingEmailUser) {
        this.logger.warn(`Email already in use: ${email}`);
        throw new BadRequestException('Email already in use');
      }

      // Check if username already exists
      const existingUsernameUser = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existingUsernameUser) {
        this.logger.warn(`Username already taken: ${username}`);
        throw new BadRequestException('Username already taken');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });

      this.logger.log(`Created new user: ${username} with role: ${role}`);
      return newUser;
    } catch (err) {
      this.logger.error('Error creating user', err.stack);
      throw new BadRequestException(err.message || 'Could not create user');
    }
  }

  async findOneByEmail(email: string) {
    this.logger.debug(`findOneByEmail called for: ${email}`);
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByUsername(username: string) {
    this.logger.debug(`findOneByUsername called for: ${username}`);
    return await this.prisma.user.findUnique({ where: { username } });
  }
}
