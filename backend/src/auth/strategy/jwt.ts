import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';

export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'  // assign the strategy to this name for AuthGuard
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        return { id: payload.id };
    }
}