import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { User } from "src/prisma/generated/client";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async register(dto: RegisterDto) {
		const existing = await this.usersService.findByEmail(dto.email);
		if (existing) {
			throw new ConflictException("Email already registered");
		}

		const passwordHash = await bcrypt.hash(dto.password, 10);
		const user = await this.usersService.createUser(dto.email, passwordHash);
		return this.signToken(user);
	}

	async validateUser(email: string, plainPassword: string): Promise<User | null> {
		const user = await this.usersService.findByEmail(email);
		if (!user) return null;

		const passwordMatch = await bcrypt.compare(plainPassword, user.passwordHash);
		if (!passwordMatch) return null;

		return user;
	}

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto.email, dto.password);
		if (!user) {
			throw new UnauthorizedException("Invalid credentials");
		}
		return this.signToken(user);
	}

	loginWithUser(user: User): { access_token: string } {
		return this.signToken(user);
	}

	private signToken(user: User) {
		const payload = { sub: user.id, email: user.email };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
