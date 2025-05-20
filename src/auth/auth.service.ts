// src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Validate user by email + password
  // async validateUser(email: string, pass: string): Promise<any> {
  //   const user = await this.userService.findOneByEmail(email);  // findOneByEmail to be implemented in UserService
  //   if (user && await bcrypt.compare(pass, user.password)) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }



  // Login generates JWT token with username and user ID
  async login(user: { id: number; username: string }) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Register new user with email, username, and password
  async register(email: string, username: string, password: string) {
    const existingUserByEmail = await this.userService.findOneByEmail(email);
    if (existingUserByEmail) {
      throw new BadRequestException('Email already in use');
    }

    const existingUserByUsername = await this.userService.findOneByUsername(username);
    if (existingUserByUsername) {
      throw new BadRequestException('Username already taken');
    }

    // Hash password inside UserService.createUser
    const newUser = await this.userService.createUser({ email, username, password });

    return this.login(newUser);
  }
}
