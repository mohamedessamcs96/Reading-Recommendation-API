import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '1234', // IMPORTANT: Use env var in prod!
    });
  }

  async validate(payload: any) {
    // payload.sub and payload.email should be included in your JWT payload on sign
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
