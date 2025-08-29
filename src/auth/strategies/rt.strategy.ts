import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadInterface } from "../interfaces/payload.interface";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";



@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private confingService: ConfigService
    ) {
         const secret = confingService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET must be defined in environment variables');
    }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.['refresh_token'];
                },]),

            secretOrKey: secret

        })
    }

    async validate(payload: PayloadInterface) {
        
        return {
         
            id: payload.sub,
            role: payload.role,
            institutionId: payload.institutionId
       
        }
    }
}