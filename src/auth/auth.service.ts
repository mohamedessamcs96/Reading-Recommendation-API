import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

type UserRole = 'user' | 'admin';

interface UserWithRole {
  id: number;
  username: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user by username and password.
   * Returns user data (without password) if valid, else null.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    console.log('User from DB:', user);
    const match = user && await bcrypt.compare(pass, user.password);
    console.log('Password match:', match);
    if (match) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Logs in a user and generates a JWT token including username, user ID, and role.
   */
  async login(user: UserWithRole) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Registers a new user after checking for duplicate email or username.
   * Role defaults to 'user' if invalid or not provided.
   * Returns JWT token upon successful registration.
   */
  async register(
    email: string,
    username: string,
    password: string,
    role?: string,
  ) {
    const allowedRoles: UserRole[] = ['user', 'admin'];
    const normalizedRole: UserRole = allowedRoles.includes(role as UserRole)
      ? (role as UserRole)
      : 'user';

    const existingUserByEmail = await this.userService.findOneByEmail(email);
    if (existingUserByEmail) {
      throw new BadRequestException('Email already in use');
    }

    const existingUserByUsername = await this.userService.findOneByUsername(username);
    if (existingUserByUsername) {
      throw new BadRequestException('Username already taken');
    }

    // Pass raw password, hashing will be done inside createUser
    const newUser = await this.userService.createUser({
      email,
      username,
      password,
      role: normalizedRole,
    });

    const userWithRole: UserWithRole = {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role as UserRole,
    };

    return this.login(userWithRole);
  }
}
