import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadInterface } from '../interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET must be defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: PayloadInterface) {
    return {
      id: payload.sub,
      role: payload.role,
      institutionId: payload.institutionId,
    };
  }
}
