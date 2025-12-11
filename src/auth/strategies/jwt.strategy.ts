import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EnvironmentVariables } from "src/config/environment-variables";

interface JwtPayload {
	sub: number;
	email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService<EnvironmentVariables>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get("JWT_SECRET"),
		});
	}

	async validate(payload: JwtPayload) {
		return { userId: payload.sub, email: payload.email };
	}
}
